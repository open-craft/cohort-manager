import { Cohort } from "./Types";

export async function getCohorts(courseId: string): Promise<Cohort[]> {
  let pageNumber = 1;
  let results: Cohort[] = [];
  while (true) {
    const response = await fetch(
      `/api/cohorts/v1/courses/${courseId}/cohorts/?page_size=100&page=${pageNumber}`
    );
    if (!response.ok) {
      if (response.status === 404 && pageNumber !== 1) {
        // This means that we've reached the end of the pagination, so break
        // cleanly.
        break;
      }
      console.log("Response not ok:", response);
      throw new Error(response.statusText);
    }
    const page = await response.json();
    results = results.concat(page);
    pageNumber += 1;
  }
  return results;
}
