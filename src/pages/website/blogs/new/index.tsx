import React, { useEffect } from "react";
import { Layout } from "../../../../layout";
import { useCreateNewBlogMutation } from "../../../../app/api";
import { AppButton, AppInput, PageTitle } from "../../../../component";
import { Formik } from "formik";
import { IBlogsProps } from "../../../../interface";
import ReactQuill from "react-quill";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const NewBlogPage = () => {
  const [NewBlog, { isLoading, isSuccess, data, isError, error }] =
    useCreateNewBlogMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isError) {
      console.log(error);
    }
  }, [isError, error]);

  useEffect(() => {
    if (isSuccess) {
      navigate("/blogs/manage");
      toast.success(data?.data as string);
    }
  }, [isSuccess, navigate, data?.data]);

  const handleSubmit = async (data: any) => {
    console.log(data);
    await NewBlog(data);
  };
  return (
    <Layout pageTitle="Write blogs for user">
      <PageTitle
        title={`Upload Blogs`}
        subTitle="Upload Or Manage blogs for your users"
        rightAction={() => null}
        rightText="List Blogs"
      />
      <Formik
        onSubmit={handleSubmit}
        initialValues={
          { body: "", label: "", subLabel: "", blogLink: "" } as IBlogsProps
        }
      >
        {({
          handleBlur,
          handleChange,
          handleSubmit,
          values,
          touched,
          errors,
        }) => (
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div>
              <AppInput
                label="Title of blog"
                name="label"
                value={values.label}
                onChange={handleChange("label")}
                onBlur={handleBlur("label")}
                touched={touched.label}
                error={errors.label}
              />
            </div>
            <div>
              <label className="block text-poppins text-gray-500 capitalize text-sm mb-1">Blog Image</label>
              <input
                type="file"
                accept="image/*"
                // onChange={(e) => {
                //   if (e.currentTarget.files?.[0]) {
                //     setImage(e.currentTarget.files[0]);
                //   }
                // }}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
               file:rounded-full file:border-0 file:text-sm file:font-semibold
               file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
              />
            </div>

            <div className="flex items-center gap-5">
              <AppInput
                label="Sub Title"
                name="Sub Title"
                value={values.subLabel}
                onChange={handleChange("subLabel")}
                onBlur={handleBlur("subLabel")}
                touched={touched.subLabel}
                error={errors.subLabel}
              />
              <AppInput
                label="Blog Link"
                value={values.blogLink}
                onChange={handleChange("blogLink")}
                onBlur={handleBlur("blogLink")}
                touched={touched.blogLink}
                error={errors.blogLink}
                placeholder="https://"
              />
            </div>
            <div>
              <ReactQuill
                style={{ height: 400 }}
                value={values.body}
                onChange={handleChange("body")}
                onBlur={handleBlur("body")}
              />
            </div>
            <div className="flex justify-end my-10">
              <AppButton loading={isLoading} primary type="submit">
                Save Blog
              </AppButton>
            </div>
          </form>
        )}
      </Formik>
    </Layout>
  );
};
