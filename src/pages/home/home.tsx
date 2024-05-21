import {
  Box,
  CircularProgress,
  Grid,
  TextField,
  Typography,
  Zoom,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { InView } from "react-intersection-observer";
import { FilterField } from "shared/components/filter-field/filter-field";
import { JobCard } from "shared/components/job-card/job-card";
import { useAppDispatch, useTypedSelector } from "shared/store";
import { clampArrayWithNewValue } from "shared/utils";
import { filterOptions } from "./filters-options";
import { HomeActions, fetchInitialJobs, fetchMoreJobs } from "./home-reducer";
import { SearchOff } from "@mui/icons-material";

export const Home = () => {
  const appDispatch = useAppDispatch();

  // Filter values based that the user can interact with
  const companyFilter = useTypedSelector((root) => root.home.filters.company);
  const experienceFilter = useTypedSelector(
    (root) => root.home.filters.experience
  );
  const locationFilter = useTypedSelector((root) => root.home.filters.location);
  const rolesFilter = useTypedSelector((root) => root.home.filters.roles);
  const salaryFilter = useTypedSelector((root) => root.home.filters.salary);

  const jobs = useTypedSelector((root) => root.home.jobs.data?.data);
  const jobsLoading = useTypedSelector((root) => root.home.jobs.loading);
  const jobsError = useTypedSelector((root) => root.home.jobs.error);
  const jobsPagination = useTypedSelector(
    (root) => root.home.jobs.data?.pagination
  );

  // To render the role filter data in groups, a map of role -> group is created
  // to efficiently tell which group a role falls in
  const roleOptions = useMemo(
    () => filterOptions.roles.map((role) => role.name),
    []
  );
  const roleGroups = useMemo(
    () => filterOptions.roles.map((role) => role.group),
    []
  );
  const roleGroupMappings = useMemo(() => {
    const mappings: Record<string, string> = {};
    for (let i = 0; i < roleOptions.length; i++) {
      mappings[roleOptions[i]] = roleGroups[i];
    }
    return mappings;
  }, [roleGroups, roleOptions]);

  // To control memory leaks, whenever more data is being fetched, the request
  // can be canceled by calling this method
  const fetchMoreAbortRef = useRef<(() => void) | null>();

  // Whenever a filter changes through user interaction, new data based on new filters is fetched
  useEffect(() => {
    // Terminate any existing request fetching more data for previous filters
    fetchMoreAbortRef.current?.call(null);
    fetchMoreAbortRef.current = null;
    const { abort } = appDispatch(fetchInitialJobs());
    return () => abort();
  }, [
    appDispatch,
    companyFilter,
    experienceFilter,
    locationFilter,
    rolesFilter,
    salaryFilter,
  ]);

  // Called to fetch more jobs. It safely fetches more data based on the current state of the page.
  // If there is no more data for the existing filter, this callback does nothing.
  const onFetchMoreJobs = useCallback(() => {
    if (jobsLoading || jobsError) return;
    if (!jobs) return;
    if (!jobsPagination) return;
    if (jobsPagination.total === jobs?.length) return;

    fetchMoreAbortRef.current?.call(null);
    const { abort } = appDispatch(fetchMoreJobs());
    fetchMoreAbortRef.current = abort;
  }, [appDispatch, jobs, jobsError, jobsLoading, jobsPagination]);

  // Component to render when no job results are found
  const JobsNotFoundComponent = useMemo(() => {
    if (!jobs) return;
    if (jobs.length > 0) return;
    const show = jobs && jobs.length === 0;
    return (
      <Zoom in={show} exit={false} appear mountOnEnter unmountOnExit>
        <Box display="flex" flexDirection="column" gap={1} alignItems="center">
          <SearchOff sx={{ fontSize: "128px" }} color="disabled" />
          <Typography
            textAlign="center"
            variant="h6"
            sx={{ alignSelf: "center", fontWeight: "300" }}
          >
            No results for this category at the moment
          </Typography>
        </Box>
      </Zoom>
    );
  }, [jobs]);

  // Component to render when the job results are being fetched
  const JobsLoadingComponent = useMemo(() => {
    return (
      <Zoom in={jobsLoading} exit={false} appear mountOnEnter unmountOnExit>
        <Box
          sx={{ alignSelf: "center" }}
          display="flex"
          flexDirection="row"
          gap={1.5}
          alignItems="center"
        >
          <CircularProgress size="14px" thickness={8} />
          <Typography variant="h6">Loading</Typography>
        </Box>
      </Zoom>
    );
  }, [jobsLoading]);

  // Component to render when there is an error while fetching jobs
  const JobsErrorComponent = useMemo(() => {
    if (!jobsError) return;
    return (
      <Typography color="red" sx={{ alignSelf: "center", fontWeight: "300" }}>
        {jobsError}
      </Typography>
    );
  }, [jobsError]);

  // Component to render the list of matched jobs
  const JobListingComponent = useMemo(() => {
    if (!jobs) return;
    if (jobs.length === 0) return;
    return (
      <Grid container spacing={3}>
        {jobs?.map((job) => (
          <Grid
            component={Box}
            item
            key={job.jdUid}
            xs={12}
            sm={12}
            lg={6}
            xl={4}
          >
            <JobCard data={job} />
          </Grid>
        ))}
      </Grid>
    );
  }, [jobs]);

  return (
    <Box width="100%" display="flex" flexDirection="column" gap={4} p={3}>
      <Box
        width="100%"
        display="flex"
        flexDirection="row"
        rowGap="16px"
        columnGap="8px"
        alignItems="end"
        flexWrap="wrap"
      >
        <FilterField
          options={roleOptions}
          value={rolesFilter}
          onChange={(value) => appDispatch(HomeActions.setFilterRoles(value))}
          groupBy={(value) => roleGroupMappings[value]}
          placeholder="Roles"
        />
        <FilterField
          options={filterOptions.experience}
          value={experienceFilter}
          onChange={(value) =>
            appDispatch(
              HomeActions.setFilterExperience(clampArrayWithNewValue(value))
            )
          }
          placeholder="Experience"
          desiredWidth="80px"
        />
        <FilterField
          options={filterOptions.location}
          value={locationFilter}
          onChange={(value) =>
            appDispatch(HomeActions.setFilterLocation(value))
          }
          placeholder="Location"
          desiredWidth="100px"
        />
        <FilterField
          options={filterOptions.salary}
          value={salaryFilter}
          onChange={(value) =>
            appDispatch(
              HomeActions.setFilterSalary(clampArrayWithNewValue(value))
            )
          }
          placeholder="Minimum Salary"
          desiredWidth="140px"
        />
        <TextField
          value={companyFilter}
          onChange={(evt) => {
            appDispatch(HomeActions.setFilterCompany(evt.target.value));
          }}
          sx={{ width: "240px" }}
          placeholder="Search By Company"
        />
      </Box>
      {JobsNotFoundComponent}
      {JobListingComponent}
      {JobsLoadingComponent}
      {JobsErrorComponent}
      <InView as="div" onChange={(inView) => inView && onFetchMoreJobs()} />
    </Box>
  );
};
