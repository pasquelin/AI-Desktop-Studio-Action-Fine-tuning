/**
 * One model round trip crosses three waits: the guest asks over the connection running it, the
 * host relays the question to the local model, and the guest reads the answer back on that same
 * connection. Each wait must outlive the one it contains, or a slow inference is reported by
 * whichever deadline happens to expire first — the guest's « réponse » message instead of the
 * host's « relais », for the same cause. Deriving them from one budget makes that order hold by
 * construction.
 */
export const PROVIDER_PROBE_MS = 3_000
export const MODEL_INFERENCE_MS = 120_000
/** Only inference can make the parent's answer late; the rest of the relay is local bookkeeping. */
export const RELAY_MS = MODEL_INFERENCE_MS + 30_000
/** The guest still listens when the host gives up, so the host's diagnosis is the one that lands. */
export const GUEST_WAIT_MS = RELAY_MS + 25_000
/** A journey runs many actions; its own budget must hold several complete round trips. */
export const SCENARIO_RUN_MS = 900_000
