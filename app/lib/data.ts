import { sql } from '@vercel/postgres';
import axios from "axios";
import React, { useState } from 'react';

import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  User,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils';

export async function fetchRevenue() {
  // Add noStore() here to prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).

  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue>`SELECT * FROM revenue`;

    // console.log('Data fetch completed after 3 seconds.');

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await sql<LatestInvoiceRaw>`
      SELECT invoices.amount, users.name, users.image_url, users.email, invoices.id
      FROM invoices
      JOIN users ON invoices.customer_id = users.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM users`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
    const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;

export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        users.name,
        users.email,
        users.image_url
      FROM invoices
      JOIN users ON invoices.customer_id = users.id
      WHERE
        users.name ILIKE ${`%${query}%`} OR
        users.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN users ON invoices.customer_id = users.id
    WHERE
      users.name ILIKE ${`%${query}%`} OR
      users.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    const data = await sql<CustomerField>`
      SELECT
        id,
        name
      FROM users
      ORDER BY name ASC
    `;

    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType>`
		SELECT
    users.id,
    users.name,
    users.email,
    users.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON users.id = invoices.customer_id
		WHERE
    users.name ILIKE ${`%${query}%`} OR
    users.email ILIKE ${`%${query}%`}
		GROUP BY users.id, users.name, users.email, users.image_url
		ORDER BY users.name ASC
	  `;

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

export async function getUser(email: string) {
  try {
    const user = await sql`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0] as User;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export async function getCartGoods( customer_id : string) {
  // var cartGoods = (await axios.get("http://localhost:3000/cartGood/readCartGood.php")).data

const PATH = 'http://localhost:3000/cartGood/readCartGood.php';
  try {
    // 发送GET请求并传递customer_id作为参数
    const response = await axios.get(PATH, {
      params: { customer_id },
      headers: { 'content-type': 'application/json' },
    });
    // 将响应数据转换为数组
    const cartGoods = (response.data);
    return cartGoods
  } catch (e) {
    console.error("Error fetching cart goods:", e);
    throw e; // 抛出错误，以便调用者可以处理
  }
}

// 更新购物车商品数量
export async function editCartGoods(customer_id: string, id: string, amount: number) {
  const PATH = 'http://localhost:3000/cartGood/editCartGood.php'; 
  try {
    const response = await axios.post(PATH, {
      customer_id:customer_id,
      id:id,
      amount:amount,
    }, {
      headers: {
        'Content-Type': 'multipart/form-data'
      } 
    });

    if (response.status === 200) {
      const updatedCartGoods = response.data;
      console.log('Cart goods updated successfully:', updatedCartGoods);
      return updatedCartGoods;
    } else {
      throw new Error(`Server responded with status code: ${response.status}`);
    }
  } catch (error) {
    console.error("Error updating cart goods:", error);
    throw error;
  }
}

// 删除购物车商品
export async function deleteCartGoods(id: string) {
  const PATH = 'http://localhost:3000/cartGood/deleteCartGood.php'; 
  try {
    const response = await axios.post(PATH, {
      id:id
    }, {
      headers: {
        'Content-Type': 'multipart/form-data'
      } 
    });

    if (response.status === 200) {
      const updatedCartGoods = response.data;
      console.log('Cart goods delete successfully:', updatedCartGoods);
      return updatedCartGoods;
    } else {
      throw new Error(`Server responded with status code: ${response.status}`);
    }
  } catch (error) {
    console.error("Error delete cart goods:", error);
    throw error;
  }
}


// 提交选中商品的函数
export async function addOrderGoods(cartGoods_id) {
  const PATH = 'http://localhost:3000/orders/addOrder.php'; 
  try {
    const response = await axios.post(PATH, {
      cartGoods_id:cartGoods_id,
    }, {
      headers: {
        'Content-Type': 'multipart/form-data'
      } 
    });

    if (response.status === 200) {
      const updatedCartGoods = response.data;
      console.log('Add order successfully:', updatedCartGoods);
      return updatedCartGoods;
    } else {
      throw new Error(`Server responded with status code: ${response.status}`);
    }
  } catch (error) {
    console.error("Error add order goods:", error);
    throw error;
  }
};

// 提交选中商品的函数
export async function addCartGoods(customer_id, goods_id) {
  const PATH = 'http://localhost:3000/orders/addCartGood.php'; 
  try {
    const response = await axios.post(PATH, {
      customer_id:customer_id,
      goods_id:goods_id
    }, {
      headers: {
        'Content-Type': 'multipart/form-data'
      } 
    });

    if (response.status === 200) {
      const updatedCartGoods = response.data;
      console.log('Add order successfully:', updatedCartGoods);
      return updatedCartGoods;
    } else {
      throw new Error(`Server responded with status code: ${response.status}`);
    }
  } catch (error) {
    console.error("Error add order goods:", error);
    throw error;
  }
};