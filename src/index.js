export default function Synthesizer(Context) {
  const context = new Context()

  return {
    play(name) {},

    stop(name) {},

    setTone({oscillators = [], noises = []}) {},

    addSound(name, {oscillators = [], noises = []}) {},

    removeSound(name) {}
  }
}
