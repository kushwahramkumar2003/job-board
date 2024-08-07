"use client";

import { useState, useEffect } from "react";
import JobCard from "@/components/JobCard";
import Sidebar from "@/components/Sidebar";
import { cn } from "@/lib/utils";
import { getJobs } from "@/actions/job";
import { Job } from "@prisma/client";
import { JobCardSkeleton } from "@/components/JobCardSkeleton";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";


interface GetJobSchemaType {
    title?: string;
    companyName?: string;
    location?: string;
    currency?: "INR" | "USD";
    salRange: [number, number];
    page?: number;
    pageSize?: number;
}


const JobsPage = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10); // Define the number of jobs per page
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState<GetJobSchemaType>({
        title: "",
        companyName: "",
        location: "",
        currency: "INR",
        salRange: [0, 1000000],
    });

    const fetchJobs = async () => {
        setLoading(true);
        const response = await getJobs({ ...filters, page, pageSize });
        if (response.status === "success") {
            setJobs(response.data as Job[]);
            setTotalPages(response.totalPages as number);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchJobs();
    }, [filters, page]);

    return (
        <section className="relative w-full h-fit flex gap-2 flex-grow p-2">
            <Sidebar setFilters={setFilters} setPage={setPage} setLoading={setLoading} />
            <section className="w-full h-fit flex flex-col gap-8 rounded-md py-4 px-6">
                <div className="flex flex-col gap-1">
                    <h3 className="lg:text-5xl text-gray-900 tracking-tight font-semibold">
                        All Developer Jobs
                    </h3>
                    <p className="lg:text-lg font-medium text-gray-500 tracking-tighter">
                        Amplify Your Career: Where Top Developers Meet 100x Opportunities
                    </p>
                </div>
                <div
                    className={cn(
                        "jobs flex flex-col max-h-[420px] gap-3 overflow-y-scroll",
                        {
                            "h-[420px] flex justify-center items-center": jobs.length === 0 && !loading,
                        }
                    )}
                >
                    {loading ? (
                        [0, 1, 2, 3, 4].map((index) => <JobCardSkeleton key={index + 100} />)
                    ) : jobs.length === 0 ? (
                        <h3 className="text-2xl font-semibold text-gray-800">No Jobs Found!</h3>
                    ) : (
                        <>
                            {jobs.map((job) => <JobCard key={job.id} job={job}/>)}
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious

                                            className={"cursor-pointer"}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (page > 1) setPage(page - 1);
                                            }}
                                        />
                                    </PaginationItem>
                                    {[...Array(totalPages)].map((_, index) => (
                                        <PaginationItem key={index}>
                                            <PaginationLink
                                                className={"cursor-pointer"}
                                                isActive={page === index + 1}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setPage(index + 1);
                                                }}
                                            >
                                                {index + 1}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}
                                    <PaginationItem>
                                        <PaginationNext
                                            className={"cursor-pointer"}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (page < totalPages) setPage(page + 1);
                                            }}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </>

                    )}

                </div>

            </section>
        </section>
    );
};

export default JobsPage;
