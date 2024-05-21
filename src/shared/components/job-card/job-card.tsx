import { Box, Button, Grow, Stack, Typography, styled } from "@mui/material";
import { useMemo, useState } from "react";
import { Job } from "shared/models/job";

const Root = styled("div")({
  border: "1px solid #CCC",
  padding: "24px",
  borderRadius: "16px",
  background: "snow",
  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 4px 0px",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
});

const Logo = styled("img")({
  width: "48px",
  borderRadius: "8px",
});

export const JobCard = (props: JobCardProps) => {
  const {
    data: { minJdSalary, maxJdSalary, salaryCurrencyCode },
  } = props;

  // View whole description using the view more button
  const [expanded, setExpanded] = useState(false);

  // Construct the text to be shown as the estimated salary
  const estimatedSalary = useMemo(() => {
    if (!minJdSalary && !maxJdSalary) return null;
    const prefix = "Estimated Salary";
    const suffix = "LPA ✅";
    if (minJdSalary && maxJdSalary) {
      return `${prefix}: ${salaryCurrencyCode} ${minJdSalary} - ${maxJdSalary} ${suffix}`;
    }
    if (minJdSalary) {
      return `${prefix}: ${salaryCurrencyCode}${minJdSalary} ${suffix}`;
    }
    return `${prefix}: ${salaryCurrencyCode} ${maxJdSalary} ${suffix}`;
  }, [maxJdSalary, minJdSalary, salaryCurrencyCode]);

  return (
    <Grow in appear>
      <Root>
        <Box display="flex" flexDirection="row" gap={2} alignItems="center">
          <Logo src={props.data.logoUrl} alt={props.data.companyName} />
          <Box display="flex" flexDirection="column">
            <Typography
              variant="h6"
              sx={{ fontWeight: "300", textTransform: "capitalize" }}
            >
              {props.data.companyName}
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: "300", textTransform: "capitalize" }}
            >
              {props.data.jobRole}
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: "500", textTransform: "capitalize" }}
            >
              {props.data.location}
            </Typography>
          </Box>
        </Box>
        {estimatedSalary && (
          <Typography sx={{ fontWeight: "400" }} color="GrayText">
            {estimatedSalary}
          </Typography>
        )}
        <Box position="relative">
          <Box
            overflow="hidden"
            position="relative"
            sx={{
              maxHeight: expanded ? "auto" : "140px",
              background: expanded
                ? null
                : "-webkit-linear-gradient(#000, #CCC, #FFF)",
              WebkitBackgroundClip: expanded ? null : "text",
              WebkitTextFillColor: expanded ? null : "transparent",
            }}
          >
            <Typography variant="body2">
              {props.data.jobDetailsFromCompany}
            </Typography>
          </Box>
          {!expanded && (
            <Box
              position="absolute"
              left={0}
              right={0}
              bottom={0}
              zIndex={400}
              display="flex"
              justifyContent="center"
            >
              <Button onClick={() => setExpanded(true)} variant="text">
                View Job
              </Button>
            </Box>
          )}
        </Box>
        {props.data.minExp && (
          <Stack>
            <Typography variant="body2" fontWeight="300">
              Minimum Experience
            </Typography>
            <Typography>{props.data.minExp} Years</Typography>
          </Stack>
        )}
        <Button
          fullWidth
          variant="contained"
          sx={{
            background: "#54EFC2",
            color: "black",
            boxShadow: 0,
            border: "1px solid #CCC",
            "&:hover": {
              background: "#44DFB2",
              boxShadow: 0,
            },
          }}
        >
          Easy Apply
        </Button>
        <Button
          sx={{
            boxShadow: 0,
            "&:hover": {
              boxShadow: 0,
            },
          }}
          fullWidth
          variant="contained"
        >
          Unlock Referral Asks
        </Button>
      </Root>
    </Grow>
  );
};

export interface JobCardProps {
  data: Job;
}
