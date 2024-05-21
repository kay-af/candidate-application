import { ChevronRight, Close } from "@mui/icons-material";
import {
  AutocompleteGroupedOption,
  Box,
  Divider,
  Typography,
  autocompleteClasses,
  styled,
  useAutocomplete,
} from "@mui/material";
import { Fragment, useMemo } from "react";
import { FilterFieldChip } from "./filter-field-chip";

const FieldRoot = styled("div")({
  padding: "12px 16px",
  paddingRight: "8px",
  borderRadius: "4px",
  border: "1px solid #CCC",
  outline: "2px solid transparent",
  outlineOffset: "-2px",
  transition: "150ms border",
  "&:hover": {
    borderColor: "#B3B3B3",
  },
  "&:focus-within": {
    outline: "2px solid #66A3FF",
  },
  display: "flex",
  flexDirection: "row",
  gap: "8px",
  alignItems: "center",
  ".filter-field-adornment": {
    color: "#CCC",
    transition: "150ms",
  },
  "&:hover .filter-field-adornment": {
    color: "black",
  },
});

const InputContainer = styled("div")({
  display: "flex",
  flexDirection: "row",
  gap: "8px",
  alignItems: "center",
  flexWrap: "wrap",
});

const Input = styled("input")(
  ({ desiredWidth }: { desiredWidth?: React.CSSProperties["minWidth"] }) => ({
    border: 0,
    outline: 0,
    padding: "3px 0px",
    fontSize: "14px",
    flexGrow: 1,
    maxWidth: desiredWidth,
    "&::placeholder": {
      fontWeight: 300,
      color: "black",
      opacity: 0.3,
    },
  })
);

const IconButton = styled("button")({
  border: 0,
  outline: 0,
  background: "transparent",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const OptionsBox = styled("ul")({
  left: 0,
  right: 0,
  marginTop: "8px",
  padding: 0,
  position: "absolute",
  listStyle: "none",
  overflow: "auto",
  maxHeight: "240px",
  borderRadius: "4px",
  background: "white",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.15)",
  zIndex: 1,

  "& li": {
    padding: "8px 16px",
    display: "flex",
    fontSize: "12px",
    "& span": {
      flexGrow: 1,
      textTransform: "capitalize",
    },
    [`&.${autocompleteClasses.focused}`]: {
      backgroundColor: "#e6f7ff",
      cursor: "pointer",
    },
  },
});

export const FilterField = (props: FilterFieldProps) => {
  const { options, value, onChange, groupBy, placeholder } = props;

  // Using material's useAutocomplete hook to create custom design for the
  // filter text field
  const {
    getRootProps,
    getInputProps,
    getTagProps,
    value: autocompleteValue,
    groupedOptions,
    getListboxProps,
    getOptionProps,
    getClearProps,
  } = useAutocomplete({
    multiple: true,
    options,
    value,
    groupBy,
    filterSelectedOptions: true,
    openOnFocus: true,
    onChange: (_, value) => onChange(value),
  });

  const inputProps = useMemo(() => getInputProps(), [getInputProps]);

  const OptionsListComponent = useMemo(() => {
    // To render a single selectable item in the list
    const mapOptions = (option: string, index: number) => {
      const props = getOptionProps({ option, index });
      return (
        <li {...props} key={index}>
          <span>{option}</span>
        </li>
      );
    };

    // If the group by method is provided, groups must be rendered too
    if (groupBy) {
      let offset = 0;
      return (groupedOptions as AutocompleteGroupedOption<string>[]).map(
        ({ group, key, options }, index) => {
          if (index > 0) {
            offset += (
              groupedOptions[index - 1] as AutocompleteGroupedOption<string>
            ).options.length;
          }
          return (
            <Fragment key={key}>
              <Typography
                textTransform="uppercase"
                p="8px 16px"
                fontSize="12px"
                color="#AAA"
              >
                {group}
              </Typography>
              {options.map((option, optionIndex) =>
                mapOptions(option, offset + optionIndex)
              )}
            </Fragment>
          );
        }
      );
    }

    return (groupedOptions as string[]).map(mapOptions);
  }, [getOptionProps, groupBy, groupedOptions]);

  return (
    <Box position="relative">
      <FieldRoot {...getRootProps()}>
        <InputContainer>
          {autocompleteValue.map((option, index) => {
            const { key, ...props } = getTagProps({ index });
            return (
              <FilterFieldChip key={key} {...props}>
                {option}
              </FilterFieldChip>
            );
          })}
          <Input
            {...inputProps}
            placeholder={placeholder}
            desiredWidth={props.desiredWidth}
          />
        </InputContainer>
        {autocompleteValue.length > 0 && (
          <IconButton className="filter-field-adornment" {...getClearProps()}>
            <Close fontSize="small" />
          </IconButton>
        )}
        <Divider orientation="vertical" flexItem variant="fullWidth" />
        <ChevronRight
          className="filter-field-adornment"
          sx={{ transform: "rotate(90deg)" }}
        />
      </FieldRoot>
      <OptionsBox {...getListboxProps()}>{OptionsListComponent}</OptionsBox>
    </Box>
  );
};

export interface FilterFieldProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  groupBy?: (option: string) => string;
  placeholder?: string;
  desiredWidth?: React.CSSProperties["minWidth"];
}
