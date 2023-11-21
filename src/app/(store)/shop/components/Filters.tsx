import PriceRange from "@/app/components/PriceRange";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Radio from "@mui/material/Radio";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

import CATEGORIES from "@/app/constants/categories";
import useSetSearchParams from "@/app/hooks/useSetSearchParams";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  ListItem,
  Rating,
  Typography
} from "@mui/material";

export interface IFilter {
  cat: string;
  subCat: string;
  priceRange: number[];
  title: string;
  color: string;
  rating: number;
  tag: string;
}

type IFilterKeys =
  | "cat"
  | "subCat"
  | "priceRange"
  | "title"
  | "color"
  | "rating"
  | "tag";

type FiltersProps = {
  filters: IFilter;
  handleUpdateFilters: (key: IFilterKeys, value: any) => void;
};

const Filters = ({ filters, handleUpdateFilters }: FiltersProps) => {
  const router = useRouter();

  const createQueryString = useSetSearchParams();

  const pathname = usePathname();
  const params = useParams(); //use this instead of passing params prop from page, layout

  const [priceRange, setPriceRange] = React.useState([100, 50000]);

  useEffect(() => {
    handleUpdateFilters("priceRange", priceRange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceRange]);

  return (
    <Box px={3} pb={4}>
      <List>
        {CATEGORIES.map(({ cat, subCats }, index) => (
          <ListItem
            key={cat + index}
            disablePadding
            
          >
            <Accordion
              disableGutters
              elevation={0}
              square
              sx={{ width: "100%" }}
              //expanded={true}
              defaultExpanded={filters.cat === cat}
              onClick={() =>
                router.push(`/shop?${createQueryString("c", cat)}`)
              }
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  borderRight: filters.cat === cat ? 3 : 0,
                  borderColor: "primary.main",
                }}
              >
                <Typography>{cat}</Typography>
              </AccordionSummary>

              <AccordionDetails sx={{ p: 0 }}>
                <List
                  sx={{
                    py: 0,
                    // bgcolor: "rgba(36, 33, 69, 0.94)",
                  }}
                >
                  {subCats.map((subCat, index) => (
                    <Box key={subCat + index}>
                      <ListItem key={subCat} disablePadding>
                        <ListItemButton
                          onClick={() => handleUpdateFilters("subCat", subCat)}
                          selected={filters.subCat === subCat}
                        >
                          <ListItemText
                            secondaryTypographyProps={
                              {
                                //sx: { color: "rgba(231, 227, 252)" },
                              }
                            }
                            sx={{ pl: 2 }}
                            secondary={subCat}
                          />
                        </ListItemButton>
                      </ListItem>
                    </Box>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          </ListItem>
        ))}
      </List>

      <Divider />

      <Typography paragraph pt={2}>
        Product rating
      </Typography>
      <Box>
        <Rating
          onChange={(event, newValue) =>
            handleUpdateFilters("rating", newValue)
          }
          //precision={0.5}
        />
      </Box>

      <Typography paragraph pt={2}>
        Price (KSH)
      </Typography>
      <PriceRange priceRange={priceRange} setPriceRange={setPriceRange} />

      <Typography paragraph pt={2}>
        Color
      </Typography>
      <List disablePadding>
        {["red", "green", "blue"].map((color, index) => (
          <ListItem
            key={index}
            alignItems="flex-start"
            dense
            disableGutters
            disablePadding
          >
            <ListItemButton
              onClick={() => handleUpdateFilters("color", color)}
              selected={filters.color === color}
              disableGutters
            >
              <Radio
                value={color}
                // onChange={handleChange}
                checked={filters.color === color}
              />

              <ListItemText
                primary={
                  <Typography textTransform="capitalize">{color}</Typography>
                }
                secondary={
                  <Typography>
                    {color === "standard" && "5 to 8 business days"}
                    {color === "economy" && "3 to 4 business days"}
                    {color === "express" &&
                      "Same day delivery(within 24 hours)"}
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Typography paragraph pt={2}>
        Promotion
      </Typography>
      <List disablePadding>
        {["Limited Edition", "Best seller", "Todays deal"].map((tag, index) => (
          <ListItem
            key={index}
            alignItems="flex-start"
            dense
            disableGutters
            disablePadding
          >
            <ListItemButton
              onClick={() => handleUpdateFilters("tag", tag)}
              selected={filters.tag === tag}
              disableGutters
            >
              <Radio
                value={tag}
                // onChange={handleChange}
                checked={filters.tag === tag}
              />

              <ListItemText
                primary={
                  <Typography textTransform="capitalize">{tag}</Typography>
                }
                //secondary={<Typography></Typography>}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
export default Filters;
