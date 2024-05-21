import jobs from "shared/mock/jobs.json";
import { JobFilter } from "shared/models/job-filter";
import { PaginatedResponse, PaginationOptions, ServiceOptions } from "./core";
import { Job } from "shared/models/job";

/**
 * Mock jobs data is filtered and returned based on the filters provided
 * @param filters The filters to apply
 * @returns The filtered jobs
 */
const getFilteredJobs = (filters: JobFilter) => {
  let data: Job[] = [...jobs];

  // Apply company name search filter
  const companySearch = filters.company.toLowerCase().trim();
  if (companySearch !== "") {
    data = data.filter((job) =>
      job.companyName.toLowerCase().includes(companySearch)
    );
  }

  // Apply the experience filter
  if (filters.experience.length !== 0) {
    const experienceSearch = Number.parseInt(filters.experience[0]);
    data = data.filter((job) => {
      if (!job.minExp) return false;
      return experienceSearch <= job.minExp;
    });
  }

  // Apply the location preference filter
  if (filters.location.length !== 0) {
    const locationSearch = filters.location;
    data = data.filter((job) => {
      if (locationSearch.includes("remote") && job.location === "remote") {
        return true;
      }
      if (locationSearch.includes("hybrid") && job.location === "hybrid") {
        return true;
      }
      if (
        locationSearch.includes("in-office") &&
        job.location !== "remote" &&
        job.location !== "hybrid"
      ) {
        return true;
      }
      return false;
    });
  }

  // Apply the roles filter
  if (filters.roles.length !== 0) {
    const roleSearch = filters.roles;
    data = data.filter((job) => {
      return roleSearch.includes(job.jobRole);
    });
  }

  // Apply the minumum salary filter
  if (filters.salary.length !== 0) {
    const salarySearch = Number.parseInt(filters.salary[0]);
    data = data.filter((job) => {
      if (!job.minJdSalary) return false;
      return salarySearch <= job.minJdSalary;
    });
  }

  return data;
};

/**
 * Mocks pagination by paginating the given list using the pagination options provided
 * @param data List of jobs to paginate
 * @param pagination Pagination options to use
 * @returns Paginated response of encapsulation the required data
 */
const paginateJobs = (
  data: Job[],
  pagination: PaginationOptions
): PaginatedResponse<Job> => {
  const { page, size } = pagination;
  const total = data.length;

  const start = (page - 1) * size;
  const end = start + size;

  // If out of range, return empty array
  if (start >= data.length) {
    return {
      data: [],
      pagination: {
        ...pagination,
        total,
      },
    };
  }

  return {
    data: data.slice(start, Math.min(end, data.length)),
    pagination: {
      ...pagination,
      total,
    },
  };
};

/**
 * Mock service to simulate jobs fetching backend
 */
export const JobService = {
  /**
   * Fetches jobs based on the provided criteria
   * @param filters Filters to apply
   * @param pagination Pagination parameters to use
   * @param options Extra options to control the call behavior
   * @returns Filtered and paginated jobs response
   */
  fetchJobs: async (
    filters: JobFilter,
    pagination: PaginationOptions,
    options: ServiceOptions
  ) => {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        const filteredJobs = getFilteredJobs(filters);
        const paginatedJobs = paginateJobs(filteredJobs, pagination);
        resolve(paginatedJobs);
      }, 2000);
      options.abortSignal?.addEventListener("abort", () => {
        clearTimeout(timeoutId);
        reject();
      });
    });
  },
};
