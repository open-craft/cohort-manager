import { Cohort, Course } from "./Types";

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
    results = results.concat(page.map((x) => {
      return {
        userCount: x.user_count,
        name: x.name,
        assignmentType: x.assignment_type,
        id: x.id,
        groupId: x.group_id,
        userPartitionId: x.user_partition_id,
      };
    }));
    pageNumber += 1;
  }
  return results;
}

export async function getCourses(): Promise<Course[]> {
  let results: Course[] = [];
  let next = '/api/courses/v1/courses/?page_size=100&page=1';
  while (next) {
    const response = await fetch(next);
    if (!response.ok) {
      if (response.status === 404) {
        // This probably means we reached the end of pagination (no results?)
        break;
      }
      console.log("Response not ok:", response);
      throw new Error(response.statusText);
    }
    const data = await response.json();
    results = results.concat(data.results.map((course) => {
      return {
       courseId: course.course_id,
       name: course.name,
      };
    }));

    next = data.pagination.next;
  }
  return results;
}

// TODO: use this
export async function checkCourseIsCohorted(courseId: string): Promise<boolean> {
    const response = await fetch(`/api/cohorts/v1/settings/${courseId}`);
    const data = await response.json();
    return data.is_cohorted;
}
