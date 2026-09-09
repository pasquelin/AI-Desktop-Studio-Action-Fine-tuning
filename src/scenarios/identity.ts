/** One definition of a journey identity and of where its authored plan lives. */
export const JOURNEYS_DIRECTORY = 'datasets/bench/journeys'
export const isJourneyId = (id: string): boolean => /^P\d{3}$/.test(id)
export const isJourneyFile = (file: string): boolean =>
  file.endsWith('.json') && isJourneyId(file.slice(0, -5))
/** Repository-relative; Node callers join it with their root. */
export const journeySource = (id: string): string => `${JOURNEYS_DIRECTORY}/${id}.json`
