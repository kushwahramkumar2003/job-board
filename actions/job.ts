"use server";

import { auth } from "@/auth";
import { SAPayload } from "@/types";
import { NewJob } from "@/zod/job";
import { prisma } from "@/lib/db";
import { Currency, Job } from "@prisma/client";

export const createJob = async (data: NewJob): Promise<SAPayload> => {
  const session = await auth();

  if (!session) {
    return { status: "error", message: "Internal Server Error" };
  }

  try {
    const newJob = await prisma.job.create({
      data: {
        userId: session.user.id as string,
        title: data.title,
        description: data.description,
        companyName: data.companyName,
        currency: data.currency as Currency,
        salary: data.salary,
        location: data.location,
      },
    });

    return { status: "success", message: "Job created Successfully" };
  } catch (error) {
    console.log(error);
    return { status: "error", message: "Internal Server Error" };
  }
};

export interface GetJobSchemaType {
  salRange: [number, number] ;
  title?: string;
  companyName?: string;
  location?: string;
  currency?: "INR" | "USD";
  page?: number;
  pageSize?: number;
}

export const getJobs = async (data: GetJobSchemaType) => {
  const { salRange, title, companyName, location, currency, page = 1, pageSize = 10 } = data;

  try {
    const [jobs, totalJobs] = await Promise.all([
      prisma.job.findMany({
        where: {
          ...(title && { title: { contains: title, mode: "insensitive" } }),
          ...(companyName && { companyName: { contains: companyName, mode: "insensitive" } }),
          ...(location && { location: { contains: location, mode: "insensitive" } }),
          ...(currency && { currency }),
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.job.count({
        where: {
          ...(title && { title: { contains: title, mode: "insensitive" } }),
          ...(companyName && { companyName: { contains: companyName, mode: "insensitive" } }),
          ...(location && { location: { contains: location, mode: "insensitive" } }),
          ...(currency && { currency }),
        },
      }),
    ]);

    const filteredJobs = jobs.filter((job) => {
      const salary = parseFloat(job.salary);
      return !isNaN(salary) && salary >= salRange[0] && salary <= salRange[1];
    });

    const totalPages = Math.ceil(totalJobs / pageSize);

    return { status: "success", data: filteredJobs, totalPages };
  } catch (error) {
    console.log(error);
    return { status: "error", message: "Internal Server Error" };
  }
};