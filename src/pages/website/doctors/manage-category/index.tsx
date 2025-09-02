import React, { useEffect, useState } from "react";
import { Layout } from "../../../../layout";
import {
  useLazyGetAllCategoryQuery,
  useCreateNewCategoryMutation,
  useDeleteCategoryByIdMutation,
  // ⬇️ NEW
  useUpdateCategoryByIdMutation,
} from "../../../../app/api";
import { AppButton, AppInput, PageTitle } from "../../../../component";
import { AiOutlineDelete, AiOutlineLoading, AiOutlineEdit } from "react-icons/ai";
import { useAppDispatch } from "../../../../app/hooks";
import {
  handleNewCategoryModel,
  useCategorySlice,
} from "../../../../app/features";
import { Formik } from "formik";
import {
  CategoryValidationSchema,
  initialCategoryValues,
} from "../../../../validation";
import { ICategoryProps } from "../../../../interface";
import { toast } from "react-toastify";
import moment from "moment";
import { useNavigate } from "react-router-dom";

export const ManageCategoryPage = () => {
  const [
    GetAllCategory,
    {
      data: category,
      isError: isCategoryError,
      error: categoryError,
      isLoading: isCategoryLoading,
    },
  ] = useLazyGetAllCategoryQuery();

  const [
    NewCategory,
    {
      data: newCategoryData,
      isError: isNewCategoryError,
      error: newCategoryError,
      isSuccess: isNewCategorySuccess,
      isLoading: isNewCategoryLoading,
    },
  ] = useCreateNewCategoryMutation();

  const [
    DeleteCategoryById,
    {
      isError: isDeleteCategoryError,
      error: deleteCategoryError,
      isLoading: isDeleteCategoryLoading,
      data: deleteCategoryData,
      isSuccess: isDeleteCategorySuccess,
    },
  ] = useDeleteCategoryByIdMutation();

  // ⬇️ NEW: update mutation
  const [
    UpdateCategoryById,
    {
      isLoading: isUpdateCategoryLoading,
      isSuccess: isUpdateCategorySuccess,
      isError: isUpdateCategoryError,
      error: updateCategoryError,
    },
  ] = useUpdateCategoryByIdMutation();

  const { newModel } = useCategorySlice();
  const dispatch = useAppDispatch();

  // ⬇️ NEW: local edit state
  const [editingCategory, setEditingCategory] = useState<ICategoryProps | null>(null);

  const onSubmitHandle = async ({ status, title }: ICategoryProps) => {
    try {
      await NewCategory({ status, title, _id: "" });
      toast.success("Category created successfully");
      dispatch(handleNewCategoryModel({ newModel: false } as any));
    } catch {
      toast.error("Failed to create category");
    }
  };

  // ⬇️ NEW: edit submit
  const onEditSubmit = async ({ status, title }: ICategoryProps) => {
    if (!editingCategory?._id) return;
    try {
      await UpdateCategoryById({
        id: editingCategory._id,
        body: { title, status },
      });
      toast.success("Category updated successfully");
      setEditingCategory(null);
    } catch {
      toast.error("Failed to update category");
    }
  };

  const DeleteAction = async (id: string) => {
    try {
      await DeleteCategoryById(id);
      toast.success("Category deleted successfully");
    } catch {
      toast.error("Failed to delete category");
    }
  };

  useEffect(() => {
    if (isCategoryError) console.log(categoryError);
    if (isNewCategoryError) console.log(newCategoryError);
    if (isDeleteCategoryError) console.log(deleteCategoryError);
    if (isUpdateCategoryError) console.log(updateCategoryError);

    (async () => {
      await GetAllCategory();
    })();
  }, [
    // refetch triggers
    newCategoryData,
    isNewCategorySuccess,
    deleteCategoryData,
    isDeleteCategorySuccess,
    isUpdateCategorySuccess,

    // keep original deps
    isNewCategoryError,
    newCategoryError,
    isNewCategoryLoading,
    isCategoryLoading,
    isCategoryError,
    categoryError,
    category?.data,
    category?.data?.length,
    isDeleteCategoryError,
    deleteCategoryError,
    isUpdateCategoryError,
    updateCategoryError,
    GetAllCategory,
  ]);

  const navigate = useNavigate();

  return (
    <Layout pageTitle="Manage Categories">
      <div>
        <PageTitle
          title={`Manage Categories`}
          subTitle="You can manage mentor types here e.g Healers, Buddy, Genie"
        />
      </div>

      <div className="flex justify-end items-center mb-8 gap-3">
        <AppButton
          primary
          onClick={() =>
            dispatch(handleNewCategoryModel({ newModel: true } as any))
          }
        >
          Add New Category
        </AppButton>
      </div>

      {category?.data.length !== 0 &&
        !isCategoryLoading &&
        !isDeleteCategoryLoading && (
          <div className="grid xl:grid-cols-3 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {category?.data.map(({ status, title, _id, createdAt }) => (
              <div
                key={_id}
                className="relative group border border-solid border-gray-200 rounded-2xl p-4 transition-all duration-500"
              >
                <div className="mb-6 flex items-center justify-between">
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 26 26"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.66699 12.8162L11.3501 15.4993C11.5616 15.7107 11.9043 15.7109 12.1158 15.4997L17.8753 9.75033M13.0003 23.8337C7.01724 23.8337 2.16699 18.9834 2.16699 13.0003C2.16699 7.01724 7.01724 2.16699 13.0003 2.16699C18.9834 2.16699 23.8337 7.01724 23.8337 13.0003C23.8337 18.9834 18.9834 23.8337 13.0003 23.8337Z"
                      className={!status ? "stroke-red-500" : "stroke-green-500"}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <div className="flex items-center gap-2 opacity-100">
                    <button
                      onClick={() =>
                        setEditingCategory({ _id, title, status } as ICategoryProps)
                      }
                      className="border border-transparent hover:border-blue-500 p-1 rounded-md"
                      title="Edit"
                      type="button"
                    >
                      <AiOutlineEdit size={20} className="hover:fill-blue-500" />
                    </button>
                    <button
                      onClick={() => DeleteAction(_id as string)}
                      className="border border-transparent hover:border-red-500 p-1 rounded-md"
                      title="Delete"
                      type="button"
                    >
                      <AiOutlineDelete size={20} className="hover:fill-red-500" />
                    </button>
                  </div>
                </div>

                <h4 className="text-base font-semibold text-gray-900 mb-2 capitalize transition-all duration-500">
                  {title}
                </h4>
                <p className="text-sm font-normal text-gray-500 transition-all duration-500 leading-5">
                  Provides faster transaction, so money arrives in realtime
                </p>
                <div className="flex justify-between mt-3 items-center">
                  <p className="text-sm text-gray-500">
                    {moment(createdAt).format("Do MMM YYYY hh:mm A")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

      {isCategoryLoading && isDeleteCategoryLoading && (
        <div className="flex justify-center items-center h-[300px]">
          <AiOutlineLoading size={150} className="fill-primary-500 animate-spin" />
        </div>
      )}

      {/* Create Modal (existing) */}
      {newModel && (
        <Formik
          initialValues={initialCategoryValues}
          validationSchema={CategoryValidationSchema}
          onSubmit={onSubmitHandle}
        >
          {({ handleBlur, handleChange, handleSubmit, values, errors, touched }) => (
            <form onSubmit={handleSubmit}>
              <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative w-auto my-6 mx-auto max-w-3xl">
                  <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                      <h3 className="text-3xl font-semibold capitalize">
                        create new category for mentors
                      </h3>
                    </div>
                    <div className="relative p-6 flex-auto">
                      <AppInput
                        placeholder="Enter title"
                        value={values.title}
                        onChange={handleChange("title")}
                        onBlur={handleBlur("title")}
                        error={errors.title}
                        touched={touched.title}
                      />
                      <div className="flex items-center gap-3 justify-start text-gray-500">
                        <input
                          onChange={handleChange("status")}
                          onBlur={handleBlur("status")}
                          name="status"
                          id="status"
                          type="checkbox"
                          checked={values.status}
                        />
                        <label className="select-none" htmlFor="status">
                          Upload as active
                        </label>
                        <p>(This option will display category on website's home)</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                      <button
                        className="text-red-500 font-bold uppercase px-6 py-2 text-sm mr-1 mb-1"
                        type="button"
                        onClick={() => dispatch(handleNewCategoryModel({ newModel: false } as any))}
                      >
                        Close
                      </button>
                      <button
                        className="bg-emerald-500 text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg"
                        type="submit"
                        disabled={isNewCategoryLoading}
                      >
                        {isNewCategoryLoading ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="opacity-25 fixed inset-0 z-40 bg-black" />
            </form>
          )}
        </Formik>
      )}

      {/* ⬇️ NEW: Edit Modal */}
      {editingCategory && (
        <Formik
          enableReinitialize
          initialValues={{
            title: editingCategory.title || "",
            status: Boolean(editingCategory.status),
            _id: editingCategory._id || "",
          }}
          validationSchema={CategoryValidationSchema}
          onSubmit={onEditSubmit}
        >
          {({ handleBlur, handleChange, handleSubmit, values, errors, touched }) => (
            <form onSubmit={handleSubmit}>
              <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative w-auto my-6 mx-auto max-w-3xl">
                  <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                      <h3 className="text-3xl font-semibold capitalize">Update category for mentors</h3>
                    </div>
                    <div className="relative p-6 flex-auto">
                      <AppInput
                        placeholder="Enter title"
                        value={values.title}
                        onChange={handleChange("title")}
                        onBlur={handleBlur("title")}
                        error={errors.title}
                        touched={touched.title}
                      />
                      <div className="flex items-center gap-3 justify-start text-gray-500">
                        <input
                          onChange={handleChange("status")}
                          onBlur={handleBlur("status")}
                          name="status"
                          id="edit-status"
                          type="checkbox"
                          checked={values.status}
                        />
                        <label className="select-none" htmlFor="edit-status">
                          Upload as active
                        </label>
                      </div>
                    </div>
                    <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                      <button
                        className="text-red-500 font-bold uppercase px-6 py-2 text-sm mr-1 mb-1"
                        type="button"
                        onClick={() => setEditingCategory(null)}
                      >
                        Close
                      </button>
                      <button
                        className="bg-blue-600 text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg disabled:opacity-60"
                        type="submit"
                        disabled={isUpdateCategoryLoading}
                      >
                        {isUpdateCategoryLoading ? "Updating..." : "Update"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="opacity-25 fixed inset-0 z-40 bg-black" />
            </form>
          )}
        </Formik>
      )}
    </Layout>
  );
};
