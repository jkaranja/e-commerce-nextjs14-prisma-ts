import formattedDate from "@/app/utils/formattedDate";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  IconButton,
  ListItem,
  Typography
} from "@mui/material";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import Image from "next/image";
import { OrderWithProducts } from "../actions/getOrders";

type OrderItemProps = {
  order: OrderWithProducts;
};

const OrderItem = ({ order }: OrderItemProps) => {
  return (
    <ListItem
      key={order.id}
      disablePadding
      // className={pathname === `${link}` ? "listItem-active" : ""}
    >
      <Accordion
        disableGutters
        elevation={0}
        square
        sx={{ width: "100%" }}
        //expanded={true}
        //defaultExpanded
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          //sx={{ bgcolor: "red" }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            width="100%"
            p={3}
            borderBottom={1}
          >
            <Typography>OrderId: #{order.id.slice(-7)}</Typography>
            <Typography>Total items: {20}</Typography>
            <Typography>Total Amount: {20}</Typography>

            <Box display="flex" columnGap={1}>
              <Typography>status </Typography>
              <Chip
                label={`${order.orderStatus}/=`}
                color="info"
                variant="outlined"
                size="small"
              />
            </Box>

            <Typography>{formattedDate(new Date(order.updatedAt))}</Typography>
          </Box>
        </AccordionSummary>

        <AccordionDetails sx={{ p: 0 }}>
          <List
            sx={{
              mx: 4,
              bgcolor: "dull.main",
            }}
          >
            {order.products.map((product, index) => (
              <Box key={product.id}>
                <ListItem
                  divider
                  //disablePadding
                  // sx={{
                  //   bgcolor: pathname.startsWith(`/vendor/${link}`)
                  //     ? "rgba(231, 227, 252, 0.08)"
                  //     : "",
                  // }}
                  secondaryAction={
                    <IconButton
                      onClick={() => window.open(`/order/${product.id}`)}
                    >
                      <OpenInNewIcon />
                    </IconButton>
                  }
                >
                  <Image
                    src={product.images[0]?.url} //File or Fetched file url
                    alt="product image"
                    loading="lazy"
                    height={100}
                    width={110}
                    style={{ objectFit: "cover" }}
                  />

                  <ListItemText
                    primary={
                      <Typography px={2} variant="h6">
                        {product.title}
                      </Typography>
                    }
                    secondary={
                      <Box px={2}>
                        <Typography color="muted.main" paragraph>
                          ID #{product.id.slice(-7)}
                        </Typography>

                        <Typography color="muted.main">Qty {3}</Typography>

                        <Typography color="muted.main" variant="subtitle2">
                          {formattedDate(new Date(product.updatedAt))}
                        </Typography>
                      </Box>
                    }
                    secondaryTypographyProps={
                      {
                        // sx: { color: "rgba(231, 227, 252)" },
                      }
                    }
                  />
                </ListItem>
              </Box>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
    </ListItem>
  );
};

export default OrderItem;
