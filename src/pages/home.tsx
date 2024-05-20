import { Box, TextField } from "@mui/material";
import { useState } from "react";
import { FilterField } from "shared/components/filter-field/filter-field";

export const Home = () => {
  const [value, setValue] = useState<string[]>([]);
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
          options={["A", "B", "C"]}
          groupBy={() => "Test"}
          value={value}
          onChange={setValue}
          placeholder="Roles"
        />
        <TextField placeholder="Search company" />
      </Box>
    </Box>
  );
};
