import React, { useEffect } from "react";
import { Layout } from "../../../../layout";
import {
  useGetAllBlogsQuery,
  useDeleteBlogByIdMutation,
} from "../../../../app/api";
import { AppButton, PageTitle } from "../../../../component";
import { AiOutlineLoading, AiOutlineDelete } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const ManageBlogPage = () => {
  const {
    data: blogs,
    isError: isBlogError,
    error: blogError,
    isLoading: isBlogLoading,
  } = useGetAllBlogsQuery();

  const [
    DeleteBlogById,
    {
      isError: isDeleteBlogError,
      error: deleteBlogError,
      isLoading: isDeleteBlogLoading,
      data: deleteBlogData,
      isSuccess: isDeleteBlogSuccess,
    },
  ] = useDeleteBlogByIdMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (isBlogError) {
      console.log(blogError);
    }
    if (isDeleteBlogError) {
      console.log(deleteBlogError);
    }
    if (isDeleteBlogSuccess) {
      toast.success(deleteBlogData?.data);
    }
  }, [
    blogError,
    isBlogError,
    isDeleteBlogError,
    deleteBlogError,
    isDeleteBlogSuccess,
    deleteBlogData?.data,
  ]);

  const DeleteAction = (id: string) => {
    DeleteBlogById(id);
  };

  return (
    <Layout pageTitle="Manage Blogs">
      <div>
        <PageTitle
          title={`Manage Blogs`}
          subTitle="Upload Or Manage blogs for your users"
        />
      </div>
      <div className="flex justify-end items-center mb-8">
        <AppButton primary onClick={() => navigate("/blogs/new")}>
          Add new
        </AppButton>
      </div>
      {isBlogLoading && !isDeleteBlogLoading && (
        <div className="flex justify-center flex-col items-center gap-4">
          <AiOutlineLoading
            size={150}
            className="animate-spin text-primary-500"
          />
          <p className="text-gray-500 font-mono">Mentors are loading....</p>
        </div>
      )}
      {!isBlogLoading && !isDeleteBlogLoading && blogs?.data.length !== 0 ? (
        <div className="grid grid-cols-1 xl:lg:grid-cols-3 gap-5">
          {blogs?.data.map(({ _id, body, label, subLabel, comment }) => (
            <div key={_id} className="border shadow-md rounded-md p-3">
              <h5 className="text-xl capitalize truncate">{label}</h5>
              <h6 className="text-gray-500 truncate">{subLabel}</h6>
              <p className="text-gray-500">{comment?.length} Comments</p>
              <div className="mt-3 flex justify-end">
                <AppButton primary onClick={() => DeleteAction(_id as string)}>
                  <AiOutlineDelete size={20} />
                </AppButton>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-lg text-center font-medium bg-gray-100 shadow-sm rounded-md py-6">
          No more data available!
        </p>
      )}
    </Layout>
  );
};
