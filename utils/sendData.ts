// This function sends form data to a specified API endpoint and handles the response.
const sendData = async (formData, setSuccess, setError, setLoading) => {
  try {
    // Replace with your API endpoint
    const response = await fetch("https://ziplugs.geniusexcel.tech/api/shipments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Failed to place order");
    }

    const result = await response.json();
    setSuccess("Order placed successfully!");
    console.log("Response:", result);
  } catch (err) {
    setError("An error occurred while placing the order....");
    console.error(err);
  } finally {
    setLoading(false);
  }
};

export default sendData;
