import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Formik } from "formik";
import { toast } from "react-toastify";

import {
  useLazyGetAllCategoryQuery,
  useCreateNewMentorMutation,
  useLazyGetMentorByIdQuery,
  useUpdateMentorByIdMutation,
} from "../../../../app/api";
import { Layout } from "../../../../layout";
import { AppInput, AppButton } from "../../../../component/ui";
import {
  setCategory,
  setLanguages,
  setSpecialists,
  useMentorSlice,
} from "../../../../app/features";
import { useAppDispatch } from "../../../../app/hooks";
import ReactQuill from "react-quill";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import { IMentorProps } from "../../../../interface";

const indianLanguages = [
  "Select Language",
  "English (English)",
  "नमस्ते (Hindi)", // Hindi
  "வணக்கம் (Tamil)", // Tamil
  "నమస్తే (Telugu)", // Telugu
  "ನಮಸ್ಕಾರ (Kannada)", // Kannada
  "નમસ્તે (Gujarati)", // Gujarati
  "নমস্কার (Bengali)", // Bengali
  "ਸਤ ਸ੍ਰੀ ਅਕਾਲ (Punjabi)", // Punjabi
  "नमस्कार (Marathi)", // Marathi
  "ഹലോ (Malayalam)", // Malayalam
  "ନମସ୍କାର (Odia)", // Odia
  "হেলো (Assamese)", // Assamese
  "હેલો (Rajasthani)", // Rajasthani
  "नमस्कार (Sanskrit)", // Sanskrit
  "नमस्कार (Konkani)", // Konkani
  "ಹಲೋ (Tulu)", // Tulu
  "ਹੈਲੋ (Dogri)", // Dogri
  "नमस्कार (Maithili)", // Maithili
  "नमस्कार (Bhojpuri)", // Bhojpuri
  "ହେଲୋ (Sambalpuri)", // Sambalpuri
  "ಹಲೋ (Kodava)", // Kodava (Coorgi)
  "হাই (Meitei)", // Meitei (Manipuri)
  "सॅल्यूट (Kashmiri)", // Kashmiri
  "हेलो (Chhattisgarhi)", // Chhattisgarhi
  "ஹலோ (Badaga)", // Badaga
  "नमस्ते (Braj Bhasha)", // Braj Bhasha
  "હેલો (Kutchi)", // Kutchi
  "हेलो (Sindhi)", // Sindhi
  "ஹலோ (Toda)", // Toda
  "ഹലോ (Mizo)", // Mizo
  "हाय (Marwari)", // Marwari
  "नमस्ते (Magahi)", // Magahi
  "নমস্কাৰ (Bodo)", // Bodo
  "ಹಲೋ (Beary)", // Beary
  "हेलो (Pahari)", // Pahari
  "हेलो (Bhili)", // Bhili
];

export const NewDoctorFormPage = () => {
  const [params] = useSearchParams();
  const mentorId = params.get("mentor");
  const [GetMentor, { data: mentor }] = useLazyGetMentorByIdQuery();
  const [
    UpdateMentor,
    {
      isLoading: isMentorUpdateLoading,
      isError: isMentorUpdateError,
      error: mentorUpdateError,
      isSuccess: isUpdateSuccess,
      data: mentorUpdateData,
    },
  ] = useUpdateMentorByIdMutation();
  const { specialists, category, languages } = useMentorSlice();
  const dispatch = useAppDispatch();

  const [
    GetAllCategory,
    {
      isError: isCategoryError,
      error: categoryError,
      isLoading: isCategoryLoading,
      data: categoryData,
    },
  ] = useLazyGetAllCategoryQuery();

  const [
    NewMentor,
    {
      isError: isNewMentorError,
      error: newMentorError,
      data: newMentorData,
      isSuccess: isNewMentorSuccess,
      isLoading: isNewLoading,
    },
  ] = useCreateNewMentorMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (mentorId) {
      (async () => {
        await GetMentor(mentorId);
      })();
    }
  }, [mentorId, GetMentor]);

  useEffect(() => {
    if (isCategoryError) {
      console.log(categoryError);
    }
    if (isNewMentorError) {
      const error: any = newMentorError;
      if (error.data) {
        toast.error(error.data.message);
      } else {
        console.log(error);
      }
    }
    if (isNewMentorSuccess) {
      toast.success(newMentorData?.data);
      navigate("/mentors/manage", { replace: true });
    }
    (async () => {
      await GetAllCategory();
    })();
  }, [
    isCategoryError,
    categoryError,
    isCategoryLoading,
    categoryData?.data,
    isNewMentorError,
    newMentorError,
    newMentorData?.data,
    isNewMentorSuccess,
    navigate,
    GetAllCategory,
  ]);

  useEffect(() => {
    if (isMentorUpdateError) {
      const error: any = mentorUpdateError;
      if (error.data) {
        toast.error(error.data.message);
      } else {
        console.log(error);
      }
    }
    if (isUpdateSuccess) {
      navigate("/mentors/manage", { replace: true });
      toast.success(mentorUpdateData?.data);
    }
  }, [
    mentorUpdateError,
    isMentorUpdateError,
    isUpdateSuccess,
    mentorUpdateData?.data,
    navigate,
  ]);

  const handleSubmit = async (e: any) => {
    console.log(e);
    const mentorBody: IMentorProps = {
      accountStatus: {
        block: false,
        online: false,
        verification: true,
      },
      acType: "MENTOR",
      auth: { password: e.password, username: e.username },
      category: category.map((prop) => prop.id),
      contact: {
        address: e.contact.address,
        email: e.contact.email,
        mobile: e.contact.mobile,
      },
      languages: languages,
      name: { firstName: e.name.firstName, lastName: e.name.lastName },
      specialists: specialists,
      videoLink: e.videoLink,
      description: e.description,
      qualification: e.qualification,
      image: e.image,
      status: true,
    };
    if (mentorId?.length) {
      await UpdateMentor({
        payload: { ...mentorBody },
        mentorId: mentorId,
      });
    } else {
      await NewMentor(mentorBody);
    }
  };
  return (
    <Layout pageTitle="New Mentor">
      <div className="mb-6 flex items-center justify-between mt-10">
        <h6 className="text-3xl font-semibold capitalize">
          {mentorId
            ? `Update ${mentor?.data.name.firstName} ${mentor?.data.name.lastName}`
            : " Creating New Mentor"}
        </h6>
        <AppButton primary onClick={() => navigate("/mentors/manage")}>
          Back
        </AppButton>
      </div>
      {!isCategoryLoading && (
        <Formik
          enableReinitialize
          onSubmit={handleSubmit}
          initialValues={{
            name: {
              firstName: mentor?.data.name.firstName || "",
              lastName: mentor?.data.name.lastName || "",
            },
            contact: {
              email: mentor?.data.contact.email || "",
              mobile: mentor?.data.contact.mobile || "",
              address: mentor?.data.contact.address || "",
            },
            username: mentor?.data.auth.username || "",
            password: mentor?.data.auth.password || "",
            videoLink: mentor?.data.videoLink || "",
            description: mentor?.data.description || "",
            category: "none",
            languages: "",
            specialization: "",
            image: mentor?.data.image || "",
            qualification: mentor?.data.qualification || "",
          }}
        >
          {({
            handleBlur,
            handleSubmit,
            handleChange,
            values,
            touched,
            errors,
          }) => (
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-5">
                {mentorId ? (
                  <>
                    <AppInput
                      label="Mentor Image"
                      value={values.image}
                      onChange={handleChange("image")}
                      onBlur={handleBlur("image")}
                      error={errors.image as string}
                      touched={touched.image as boolean}
                    />
                    <div className="flex gap-5 items-center">
                      <AppInput
                        label="First Name"
                        value={values.name.firstName}
                        onChange={handleChange("name.firstName")}
                        onBlur={handleBlur("name.firstName")}
                        error={errors.name?.firstName as string}
                        touched={touched.name?.firstName as boolean}
                      />
                      <AppInput
                        label="Last Name"
                        value={values.name.lastName}
                        onChange={handleChange("name.lastName")}
                        onBlur={handleBlur("name.lastName")}
                        error={errors.name?.lastName as string}
                        touched={touched.name?.lastName as boolean}
                      />
                    </div>
                    <div className="flex gap-5 items-center">
                      <AppInput
                        label="Email Address"
                        value={values.contact?.email}
                        onChange={handleChange("contact.email")}
                        onBlur={handleBlur("contact.email")}
                        error={errors.contact?.email as string}
                        touched={touched.contact?.email as boolean}
                      />
                      <AppInput
                        label="Contact Number"
                        value={values.contact?.mobile}
                        onChange={handleChange("contact.mobile")}
                        onBlur={handleBlur("contact.mobile")}
                        error={errors.contact?.mobile as string}
                        touched={touched.contact?.mobile as boolean}
                      />
                      <AppInput
                        label="Address"
                        value={values.contact?.address}
                        onChange={handleChange("contact.address")}
                        onBlur={handleBlur("contact.address")}
                        error={errors.contact?.address as string}
                        touched={touched.contact?.address as boolean}
                      />
                    </div>
                    <div>
                      <AppInput
                        label="Introduction Video Link"
                        value={values.videoLink}
                        onChange={handleChange("videoLink")}
                        onBlur={handleBlur("videoLink")}
                        error={errors.videoLink as string}
                        touched={touched.videoLink as boolean}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="
                    Mentor Introduction"
                        className="text-poppins text-gray-500 capitalize text-sm"
                      >
                        Mentor Introduction
                      </label>
                      <ReactQuill
                        value={values.description as string}
                        onChange={handleChange("description")}
                        onBlur={handleBlur("description")}
                        style={{ height: 300 }}
                        theme="snow"
                      />
                    </div>
                    <div className="bg-gray-100 p-3 rounded-md border mt-10">
                      <div className="flex-1">
                        <div className="flex items-center gap-5">
                          {category.length !== 0 &&
                            category.map(({ id, label }) => (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    dispatch(
                                      setCategory({
                                        id,
                                        label,
                                      })
                                    );
                                  }}
                                  type="button"
                                  className="bg-gray-200 p-2 rounded-md text-primary-500"
                                >
                                  <AiOutlineClose />
                                </button>
                                <p className="text-lg capitalize">{label}</p>
                              </div>
                            ))}
                        </div>
                        {category.length === 0 && (
                          <div>
                            <p>Select Mentor Category</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-md border">
                      <div className="flex-1">
                        <div className="flex items-center gap-5">
                          {languages.length !== 0 &&
                            languages.map((label, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    dispatch(setLanguages(label));
                                  }}
                                  type="button"
                                  className="bg-gray-200 p-2 rounded-md text-primary-500"
                                >
                                  <AiOutlineClose />
                                </button>
                                <p className="text-lg capitalize">{label}</p>
                              </div>
                            ))}
                        </div>
                        {languages.length === 0 && (
                          <div>
                            <p>Select Mentor Languages</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-md border">
                      <div className="flex-1">
                        <div className="flex items-center gap-5">
                          {specialists.length !== 0 &&
                            specialists.map((label, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    dispatch(setSpecialists(label));
                                  }}
                                  type="button"
                                  className="bg-gray-200 p-2 rounded-md text-primary-500"
                                >
                                  <AiOutlineClose />
                                </button>
                                <p className="text-lg capitalize">{label}</p>
                              </div>
                            ))}
                        </div>
                        {specialists.length === 0 && (
                          <div>
                            <p>
                              Type on Specialization Input -{" "}
                              {values.specialization}? (what you can ask
                              section)
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-10 flex items-center gap-5">
                      <div className="flex-1">
                        <label
                          htmlFor="category"
                          className="capitalize text-gray-500 text-sm"
                        >
                          Category
                        </label>
                        <select
                          onChange={(prop) => {
                            handleChange("category");
                            const selectedCategory = categoryData?.data.find(
                              (category) => category._id === prop.target.value
                            );
                            dispatch(
                              setCategory({
                                id: prop.target.value as string,
                                label: selectedCategory?.title as string, // Use title from the selected category
                              })
                            );
                          }}
                          onBlur={handleBlur("category")}
                          value={values.category as any}
                          className="p-3 w-full border focus:border-teacher-500 rounded-md focus:outline-none"
                          required
                        >
                          <option value="none" disabled selected>
                            Select category
                          </option>
                          {categoryData?.data.map((category) => (
                            <option value={category?._id} key={category?._id}>
                              {category.title}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex-1">
                        <label
                          htmlFor="category"
                          className="capitalize text-gray-500 text-sm"
                        >
                          Languages Spoken
                        </label>
                        <select
                          onChange={(prop) => {
                            handleChange("languages");
                            dispatch(setLanguages(prop.target.value));
                          }}
                          onBlur={handleBlur("languages")}
                          value={values.languages as string}
                          className="p-3 w-full border focus:border-teacher-500 rounded-md focus:outline-none"
                          required
                        >
                          <option defaultValue="none" disabled selected>
                            Languages
                          </option>
                          {indianLanguages?.map((language) => (
                            <option value={language} key={language}>
                              {language}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex-1 flex flex-row items-center gap-3">
                        <AppInput
                          onChange={handleChange("specialization")}
                          onBlur={handleBlur("specialization")}
                          value={values.specialization}
                          error={errors.specialization}
                          touched={touched.specialization}
                          label="Specialization"
                        />
                        <AppButton
                          primary
                          type="button"
                          onClick={() => {
                            dispatch(setSpecialists(values.specialization));
                            values.specialization = "";
                          }}
                        >
                          <AiOutlinePlus />
                        </AppButton>
                      </div>
                    </div>
                  </>
                ) : (
                  <></>
                )}

                <div className="flex gap-5 items-center">
                  <AppInput
                    label="Username"
                    value={values.username}
                    onChange={handleChange("username")}
                    onBlur={handleBlur("username")}
                    error={errors?.username as string}
                    touched={touched?.username as boolean}
                  />
                  <AppInput
                    label="Password"
                    value={values.password}
                    onChange={handleChange("password")}
                    onBlur={handleBlur("password")}
                    error={errors?.password as string}
                    touched={touched?.password as boolean}
                  />
                </div>
                {mentorId ? (
                  <>
                    <div>
                      <AppInput
                        value={values.qualification}
                        onChange={handleChange("qualification")}
                        onBlur={handleBlur("qualification")}
                        error={errors.qualification}
                        touched={touched.qualification}
                        label="Qualification"
                      />
                    </div>
                  </>
                ) : (
                  <></>
                )}

                <div className="flex justify-end gap-5 mb-5">
                  <AppButton type="reset" primary>
                    Clear
                  </AppButton>
                  <AppButton
                    type="submit"
                    primary
                    loading={isMentorUpdateLoading || isNewLoading}
                  >
                    Save Details
                  </AppButton>
                </div>
              </div>
            </form>
          )}
        </Formik>
      )}
    </Layout>
  );
};
