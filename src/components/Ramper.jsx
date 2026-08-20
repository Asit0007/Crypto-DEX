import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";

function Ramper() {
  const [ramper, setRamper] = useState();
  const { Moralis } = useMoralis();

  useEffect(() => {
    if (!Moralis?.Plugins?.fiat) return;
    Moralis.Plugins.fiat
      .buy({}, { disableTriggers: true })
      .then((data) => setRamper(data.data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Moralis.Plugins]);

  if (!ramper) {
    return (
      <div className="flex h-[625px] w-full max-w-[420px] items-center justify-center rounded-2xl border border-ink-border bg-ink-raised p-8 text-center text-fg-muted">
        The fiat on-ramp needs a configured Moralis server with the fiat plugin
        installed.
      </div>
    );
  }

  return (
    <iframe
      src={ramper}
      title="ramper"
      // Third-party page: locked down — no camera/payment/sensor delegation.
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      className="h-[625px] w-full max-w-[420px] rounded-2xl border border-ink-border bg-white shadow-card"
    />
  );
}

export default Ramper;
