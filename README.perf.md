# EventMitt 性能优化建议

`@jswork/event-mitt` 是一个设计简洁的事件发射器库。但在高负载或需要极致性能的场景下，可以从以下几个方面进行优化。

## 1. 处理器管理 (`on`/`off`)

**问题:**
当前 `off` 方法在移除事件处理器时，使用了 `Array.prototype.indexOf` 来查找处理器在数组中的位置。当一个事件有大量处理器时，这个操作的时间复杂度是 O(n)，可能会成为性能瓶颈。

**建议:**
将存储处理器的 `Array` 更换为 `Set`。`Set` 提供了 O(1) 时间复杂度的添加和删除操作，可以显著提升 `on` 和 `off` 的性能，尤其是在处理器频繁增删的场景。

**示例:**

```typescript
// src/index.ts (修改后)
export default class EventMitt<Events extends EventMap> {
  // 使用 Set 替代 Array
  private readonly handlers: Map<keyof Events, Set<AnyFunction>> = new Map();

  public on<Key extends keyof Events>(event: Key, handler: Events[Key]): () => void {
    let handlers = this.handlers.get(event);
    if (!handlers) {
      handlers = new Set();
      this.handlers.set(event, handlers);
    }
    handlers.add(handler);
    return () => this.off(event, handler);
  }

  public off<Key extends keyof Events>(event: Key, handler?: Events[Key]): void {
    if (!handler) {
      this.handlers.delete(event);
      return;
    }

    const handlers = this.handlers.get(event);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  public emit<Key extends keyof Events>(event: Key, ...args: Parameters<Events[Key]>>): void {
    const handlers = this.handlers.get(event);
    if (handlers) {
      // Set 的 forEach 是安全的，即使在迭代期间有修改
      handlers.forEach((fn) => fn(...args));
    }
    // ... (通配符逻辑也需要相应调整)
  }
  // ...
}
```

## 2. 通配符事件 (`*`) 处理

**问题:**
1.  `wildcardHandlers` 逻辑似乎未实现：`wildcardHandlers` 被初始化了，但在 `on` 方法中没有逻辑向其添加任何处理器。这部分代码目前是无效的。
2.  `emit` 方法中的通配符匹配效率低：每次 `emit` 调用都会遍历所有的 `wildcardHandlers`（如果它有内容的话），并执行 `wildcardMatch` 函数。如果通配符处理器很多，这将导致不必要的计算开销。

**建议:**
1.  **实现或移除 `wildcardHandlers`**：如果需要支持通配符，`on` 方法需要增加逻辑来识别通配符事件（例如，事件名包含 `*`）并将其存入 `wildcardHandlers`。如果不需要，则应移除 `wildcardHandlers` 相关的所有代码以简化实现。
2.  **优化通配符匹配**：可以引入缓存机制。在 `emit` 时，如果一个普通事件被触发，可以构建一个缓存，存储哪些通配符模式匹配了它。这个缓存可以在通配符处理器增删时失效。一个更简单的优化是，仅在 `emit` 的事件本身不是通配符时，才去检查通配符匹配。

## 3. `emit` 方法中的数组复制

**问题:**
`emit` 方法在遍历处理器前使用了 `handlers.slice()` 来创建一个数组副本。这是一个安全措施，可以防止在事件处理函数中修改处理器列表（例如，通过 `off` 或 `once`）时引发的迭代问题。

**建议:**
这是一个安全性与性能之间的权衡。
*   **保留 `slice()`**：在大多数情况下，这点性能开销是值得的，因为它可以避免一些难以调试的 bug。
*   **移除 `slice()`**：如果你的应用场景可以保证在 `emit` 期间绝不会有处理器被同步地移除，那么可以去掉 `slice()` 来减少内存分配和CPU周期。但这需要开发者对代码行为有十足的把握。

**示例 (移除 slice):**
```typescript
// 仅在确保安全时使用
public emit<Key extends keyof Events>(event: Key, ...args: Parameters<Events[Key]>>): void {
  const handlers = this.handlers.get(event);
  if (handlers) {
    // 直接遍历，性能更高，但有风险
    handlers.forEach((handler) => handler(...args));
  }
  // ...
}
```