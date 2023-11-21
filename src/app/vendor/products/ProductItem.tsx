import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { IProduct } from "@/app/types/product";
import Image from "next/image";
import formattedDate from "@/app/utils/formattedDate";
import { Product } from "@prisma/client";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Link from "next/link";
import { IconButton, Chip } from "@mui/material";

type ProductItemProps = {
  product: Product;
};

const ProductItem = ({ product }: ProductItemProps) => {
  return (
    <TableRow
      key={product.id}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <TableCell component="th" scope="row" align="left">
        <Image
          src={product.images[0]?.url} //File or Fetched file url
          alt="product"
          loading="lazy"
          height={100}
          width={110}
          style={{ objectFit: "cover" }}
        />
      </TableCell>
      <TableCell>{product.title}</TableCell>
      <TableCell>
        <Chip
          label={`${product.discountedPrice}/=`}
          color="info"
          variant="outlined"
          size="small"
        />
      </TableCell>
      <TableCell>{product.quantity}</TableCell>
      <TableCell>{product.sold || 0}</TableCell>

      <TableCell>{formattedDate(new Date(product.updatedAt))}</TableCell>
      <TableCell align="center" sx={{ minWidth: 115 }}>
        <IconButton
          color="secondary"
          component={Link}
          href={`/product/${product.id}`}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          color="error"
          component={Link}
          href={`/product/${product.id}`}
        >
          <DeleteOutlineIcon />
        </IconButton>

        <IconButton onClick={() => window.open(`/product/${product.id}`)}>
          <OpenInNewIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default ProductItem;
