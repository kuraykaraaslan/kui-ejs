// Tiny imperative command registry — parity with hooks/useCommandStore.ts.
// Pages can call window.__KuiCmdStore.register({...}) to add commands at runtime.
// TODO M2: scope-aware unregister, conditional `enabled()` gating.
(function () {
  if (window.__KuiCmdStore) return;
  var registry = {};
  var listeners = [];

  function key(cmd) {
    return cmd.id || (cmd.category + '::' + cmd.label);
  }

  function emit() {
    for (var i = 0; i < listeners.length; i++) {
      try { listeners[i](); } catch (e) { /* swallow */ }
    }
  }

  window.__KuiCmdStore = {
    register: function (cmd) {
      var k = key(cmd);
      registry[k] = cmd;
      emit();
      return function () {
        delete registry[k];
        emit();
      };
    },
    all: function () {
      var out = [];
      for (var k in registry) if (Object.prototype.hasOwnProperty.call(registry, k)) out.push(registry[k]);
      return out;
    },
    subscribe: function (fn) {
      listeners.push(fn);
      return function () {
        var idx = listeners.indexOf(fn);
        if (idx !== -1) listeners.splice(idx, 1);
      };
    }
  };
})();
