import { Close } from "@mui/icons-material";
import { Typography, styled } from "@mui/material";
import { ReactNode } from "react";

const ChipContainer = styled("div")({
  background: "#E5E5E5",
  display: "flex",
  flexDirection: "row",
  borderRadius: "4px",
  gap: "4px",
  alignItems: "center",
  overflow: "hidden",
  textTransform: "capitalize",
});

const DeleteButton = styled("button")({
  border: 0,
  outline: 0,
  padding: "0px 4px",
  alignSelf: "stretch",
  background: "transparent",
  transition: "150ms",
  "&:hover": {
    background: "green",
    color: "white",
  },
});

export const FilterFieldChip = (props: FilterFieldChipProps) => {
  const { children, tabIndex, onDelete } = props;
  return (
    <ChipContainer tabIndex={tabIndex}>
      <Typography py="3px" pl="6px" fontSize="11px">
        {children}
      </Typography>
      <DeleteButton onClick={onDelete}>
        <Close sx={{ fontSize: "11px" }} />
      </DeleteButton>
    </ChipContainer>
  );
};

export interface FilterFieldChipProps {
  children?: ReactNode;
  tabIndex?: number;
  onDelete?: (event: unknown) => void;
}
