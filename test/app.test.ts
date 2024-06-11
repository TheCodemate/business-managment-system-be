import { expect, test } from "vitest";
import request from "supertest";
import { offerRouter } from "src/modules/offer/offer.router";
import { app } from "../src/app";
import express from "express";
import {
  getOffers,
  getOffersHandler,
} from "src/modules/offer/offer.controller";
import { prisma } from "../src/prisma";

//czy pierwszenstow maja envy z command line czy .env

test("GET /api/offers", async () => {
  const expected = [
    {
      offerId: "48c1ad40-3089-4712-a637-b331bbfbfeb7",
      createdById: "4b385739-6f50-43f1-bc96-6680e223642b",
      offerTitle: "Xxx",
      offerNote: "",
      createdAt: "2024-06-06T12:05:50.306Z",
      updatedAt: "2024-06-06T12:05:50.306Z",
      uploadedProductUploadedProductId: null,
    },
    {
      offerId: "80f08a4c-8f6d-4f67-9591-a20effa64cba",
      createdById: "4b385739-6f50-43f1-bc96-6680e223642b",
      offerTitle: "Xyz",
      offerNote: "Xxxx\n\nUp bhggg",
      createdAt: "2024-06-06T11:58:51.397Z",
      updatedAt: "2024-06-06T11:58:51.397Z",
      uploadedProductUploadedProductId: null,
    },
    {
      offerId: "31636af1-60fa-4466-80c0-4dc4a00b3819",
      createdById: "4b385739-6f50-43f1-bc96-6680e223642b",
      offerTitle: "Test",
      offerNote: "",
      createdAt: "2024-06-04T13:40:03.693Z",
      updatedAt: "2024-06-04T13:40:03.693Z",
      uploadedProductUploadedProductId: null,
    },
    {
      offerId: "2130f179-87e1-4c8c-858d-61b6562bb9a2",
      createdById: "4b385739-6f50-43f1-bc96-6680e223642b",
      offerTitle: "Test",
      offerNote: "",
      createdAt: "2024-06-04T13:39:58.760Z",
      updatedAt: "2024-06-04T13:39:58.760Z",
      uploadedProductUploadedProductId: null,
    },
    {
      offerId: "578a77ab-417b-4631-871d-2dc33d4b6ca6",
      createdById: "4b385739-6f50-43f1-bc96-6680e223642b",
      offerTitle: "Lazienka - parter",
      offerNote: "Dostawa na 29.06.2024",
      createdAt: "2024-06-04T13:36:23.094Z",
      updatedAt: "2024-06-04T13:36:23.094Z",
      uploadedProductUploadedProductId: null,
    },
  ];
  // ten test przy zmianie danych przestanie działać
  const res = await request(app).get("/api/offer");
  expect(res.statusCode).toBe(200);
  expect(res.header["content-type"]).toBe("application/json; charset=utf-8");
  expect(res.body).toMatchObject(expected);
});

test("getOffers", async () => {
  const expected = [
    {
      offerId: "48c1ad40-3089-4712-a637-b331bbfbfeb7",
      createdById: "4b385739-6f50-43f1-bc96-6680e223642b",
      offerTitle: "Xxx",
      offerNote: "",
      createdAt: new Date("2024-06-06T12:05:50.306Z"),
      updatedAt: new Date("2024-06-06T12:05:50.306Z"),
      uploadedProductUploadedProductId: null,
    },
    {
      offerId: "80f08a4c-8f6d-4f67-9591-a20effa64cba",
      createdById: "4b385739-6f50-43f1-bc96-6680e223642b",
      offerTitle: "Xyz",
      offerNote: "Xxxx\n\nUp bhggg",
      createdAt: new Date("2024-06-06T11:58:51.397Z"),
      updatedAt: new Date("2024-06-06T11:58:51.397Z"),
      uploadedProductUploadedProductId: null,
    },
    {
      offerId: "31636af1-60fa-4466-80c0-4dc4a00b3819",
      createdById: "4b385739-6f50-43f1-bc96-6680e223642b",
      offerTitle: "Test",
      offerNote: "",
      createdAt: new Date("2024-06-04T13:40:03.693Z"),
      updatedAt: new Date("2024-06-04T13:40:03.693Z"),
      uploadedProductUploadedProductId: null,
    },
    {
      offerId: "2130f179-87e1-4c8c-858d-61b6562bb9a2",
      createdById: "4b385739-6f50-43f1-bc96-6680e223642b",
      offerTitle: "Test",
      offerNote: "",
      createdAt: new Date("2024-06-04T13:39:58.760Z"),
      updatedAt: new Date("2024-06-04T13:39:58.760Z"),
      uploadedProductUploadedProductId: null,
    },
    {
      offerId: "578a77ab-417b-4631-871d-2dc33d4b6ca6",
      createdById: "4b385739-6f50-43f1-bc96-6680e223642b",
      offerTitle: "Lazienka - parter",
      offerNote: "Dostawa na 29.06.2024",
      createdAt: new Date("2024-06-04T13:36:23.094Z"),
      updatedAt: new Date("2024-06-04T13:36:23.094Z"),
      uploadedProductUploadedProductId: null,
    },
  ];

  const result = await getOffers(prisma);
  expect(result).toMatchObject(expected);
});
