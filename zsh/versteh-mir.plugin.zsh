# Versteh-Mir — ein Plugin, kein grok-Wrapper.
# Oh My Zsh: custom/plugins/versteh-mir → diesen Ordner
# Sonst: source /pfad/versteh-mir/zsh/versteh-mir.plugin.zsh
# Vor compinit sourcen, oder danach noch einmal compinit.

0="${${ZERO:-${0:#$ZSH_ARGZERO}}:-${(%):-%N}}"
typeset -g VERSTEH_MIR_PLUGIN_DIR="${0:A:h}"
typeset -g VERSTEH_MIR_ROOT="${VERSTEH_MIR_PLUGIN_DIR:h}"

fpath=("${VERSTEH_MIR_PLUGIN_DIR}" $fpath)

versteh-mir() {
  if ! command -v node >/dev/null; then
    print -u2 "Node 22 wird gebraucht."
    return 127
  fi
  local script="${VERSTEH_MIR_ROOT}/src/cli/versteh-mir.ts"
  if [[ ! -f $script ]]; then
    print -u2 "CLI nicht gefunden: $script"
    return 1
  fi
  node --experimental-strip-types "$script" "$@"
}

# grok bleibt ein eigenes Kommando. Hier nicht umbiegen.
