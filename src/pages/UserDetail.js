import { Button, Col, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import httpRequest from "../config/http-request";

function UserDetail() {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.author.information);
  const [messageApi, contextHolder] = message.useMessage();
  const [dataBooking, setDataBooking] = useState([]);
  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  useEffect(() => {
    form.setFieldsValue({
      firstName: userInfo?.user?.displayName,
      email: userInfo?.user?.email,
      phoneNumber: userInfo?.user?.phoneNumber,
    });
  }, [userInfo]);

  const success = (response) => {
    messageApi.open({
      type: "success",
      content: response,
    });
  };

  function uppdateUser() {
    const email = form.getFieldValue("email");
    if (email && email.match(regex))
      httpRequest
        .put(`/user/${userInfo.user.id}`, form.getFieldsValue(true))
        .then((response) => {
          localStorage.setItem("token", response.data.newToken);
          success("Saved");
        })
        .catch((error) => {
          console.error(error);
        });
  }
  function changePassword() {
    const password = passwordForm.getFieldValue("password");
    const cPassword = passwordForm.getFieldValue("confirmPassword");
    if (password && cPassword === password) {
      httpRequest
        .put(`/user/${userInfo.user.id}`, { password })
        .then((response) => {
          success("Change Password Success");
          localStorage.removeItem("token");
          window.open("/", "_self");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  function getDataBooking() {
    httpRequest
      .get(`/booking`)
      .then((response) => {
        setDataBooking(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  useEffect(() => {
    getDataBooking();
  }, []);

  return (
    <>
      {contextHolder}
      <div className="flex justify-center mt-10 mb-44 ">
        <div className="w-1/2 bg-gray-50 border-2 rounded-2xl p-8 shadow-2xl">
          <span className="text-3xl uppercase font-semibold">
            Account Detail
          </span>
          <div className="flex justify-center items-center mt-8">
            <img
              className="rounded-[50%] w-[170px] border-2 border-gray-200 cursor-pointer"
              src={userInfo?.user?.photoURL}
              alt=""
            />
          </div>
          <div className="my-8 border-2 rounded-2xl p-4 pb-0 bg-white">
            <Form form={form}>
              <Col>
                <Form.Item
                  labelAlign="left"
                  name="firstName"
                  label="Name"
                  labelCol={{ span: 2 }}
                  rules={[
                    { required: true, message: "Please Enter Fullname!" },
                  ]}
                >
                  <Input placeholder="Enter email" />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  labelAlign="left"
                  name="email"
                  label="Email"
                  labelCol={{ span: 2 }}
                  rules={[
                    { required: true, message: "Please Enter Email!" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (value.match(regex)) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Email wrong format!")
                        );
                      },
                    }),
                  ]}
                >
                  <Input placeholder="Enter email" />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  labelAlign="left"
                  name="phoneNumber"
                  label="Phone Number"
                  labelCol={{ span: 2 }}
                >
                  <Input placeholder="Enter Phone Number" />
                </Form.Item>
              </Col>
              <div className="float-right mt-4">
                <Button className="w-[150px] h-[40px]" onClick={uppdateUser}>
                  Save
                </Button>
              </div>
            </Form>
          </div>
          <div className="my-20 border-2 rounded-2xl p-4 pb-0 bg-white">
            <Form form={passwordForm}>
              <Col>
                <Form.Item
                  labelAlign="left"
                  name="password"
                  label="Password"
                  rules={[{ required: true, message: "Please Enter Password" }]}
                  labelCol={{ span: 4 }}
                >
                  <Input.Password placeholder="Enter Password" />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  labelAlign="left"
                  name="confirmPassword"
                  label="Confirm Password"
                  rules={[
                    { required: true, message: "Please Confirm Password" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Password Not Match!")
                        );
                      },
                    }),
                  ]}
                  labelCol={{ span: 4 }}
                >
                  <Input.Password placeholder="Enter Password" />
                </Form.Item>
              </Col>
            </Form>
            <div className="float-right mt-4">
              <Button className="w-[150px] h-[40px]" onClick={changePassword}>
                Change Password
              </Button>
            </div>
          </div>
          <div className="my-20 border-2 rounded-2xl p-4 bg-white">
            <p>Booking</p>
            {dataBooking?.map((data) => {
              return <div className="pt-2 pl-2">{data.restaurantName}: {data.note}</div>;
            })}
          </div>
          {userInfo.user?.role === "admin" && (
            <div className="my-20 mb-10">
              <Button
                type="primary"
                className="w-[150px] h-[40px]"
                style={{ backgroundColor: "brown" }}
                onClick={() => {
                  navigate("/manage-user");
                }}
              >
                Manage Account
              </Button>
              <Button
                type="primary"
                className="w-[150px] h-[40px] ml-4"
                style={{ backgroundColor: "brown" }}
                onClick={() => {
                  navigate("/manage-restaurant");
                }}
              >
                Manage Restaurant
              </Button>
            </div>
          )}
          {userInfo.user?.role === "manager" && (
            <div>
              <Button
                type="primary"
                className="w-[150px] h-[40px] ml-4"
                style={{ backgroundColor: "brown" }}
                onClick={() => {
                  navigate("/manage-restaurant");
                }}
              >
                Manage Restaurant
              </Button>
              <Button
                type="primary"
                className="w-[150px] h-[40px] ml-4"
                style={{ backgroundColor: "brown" }}
                onClick={() => {
                  navigate("/manage-contributeIdeas");
                }}
              >
                Manage Feedback
              </Button>
            </div>
          )}
          <div className="float-right">
            <Button
              danger
              className="w-[150px] h-[40px]"
              onClick={() => {
                localStorage.clear();
                navigate("/login");
              }}
            >
              Log Out
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserDetail;
