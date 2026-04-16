import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { alert, successAlert, errorAlert, warningAlert } from "@/lib/utils/alert";

const SERVICE = "service_qn2pi8a"
const TEMPLATE = "template_5vq30sy"
const PUBLIC_KEY = "BffbLRP_CBAlKQWnE"

const useSendEmail = () => {
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const sendEmail = ({ form }: any) => {
    setIsLoading(true);

    if (isEmailSent) {
      alert("Your message is already sent.");
      setIsLoading(false);
      return;
    }

    emailjs.sendForm(SERVICE, TEMPLATE, form, PUBLIC_KEY).then(
      (result) => {
        successAlert("Your message was successfully sent.");
        setIsEmailSent(true);

        setIsLoading(false);
      },
      (error) => {
        errorAlert("Something went wrong. Please try again.");
        setIsLoading(false);
      },
    );
  };

  return { sendEmail, isLoading, isEmailSent };
};

export default useSendEmail;
