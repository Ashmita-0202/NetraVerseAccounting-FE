import Swal from "sweetalert2";

export const Alert = (
  title: string,
  text: string,
  icon: "error" | "success" | "warning" | "info" | "question",
  onContinue?: () => void
): Promise<boolean> => {
  const isQuestion = icon === "question";
  const showExtraButton = !!onContinue && icon === "success";

  return Swal.fire({
    title,
    text,
    icon,
    showCancelButton: showExtraButton,
    confirmButtonText: showExtraButton
      ? "Add Another"
      : isQuestion
      ? "Yes"
      : "OK",
    cancelButtonText: showExtraButton ? "Close" : isQuestion ? "No" : undefined,
  }).then((result) => {
    if (result.isConfirmed && onContinue) {
      onContinue();
      return true;
    }
    return false;
  });
};

export const Toast = {
  error: (failMessage: string) => {
    return Alert("Error", failMessage, "error");
  },

  success: (successMessage: string, onContinue?: () => void) => {
    return Alert("Success", successMessage, "success", onContinue);
  },

  question: (questionMessage: string) => {
    return Alert("Question", questionMessage, "question");
  },
};
