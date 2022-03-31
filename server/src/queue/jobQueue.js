const { default: axios } = require("axios");
const Queue = require("bull");
const jobQueue = new Queue("job-queue");
const NUM_WORKERS = 5;

// Upload images
jobQueue.process(NUM_WORKERS, async ({ data }) => {
    console.log("Inside JQ", data);
    let { jobId, menuId, images } = data;
    // console.log("INSIDE JQ 3", jobId, menuId, images);
    axios
        .post("http://localhost:5001/upload/bucket", {
            files: images,
            location: "/items",
        })
        .then((uploadResp) => {
            console.log("Upload resp", uploadResp.data);

            axios
                .put(`http://localhost:5001/menu/edit/${menuId}`, {
                    images: uploadResp.data.fileURLs,
                })
                .then((updateResp) => {
                    console.log("Update resp in job queue:", updateResp.data);
                })
                .catch((updateErr) => {
                    console.log("Update ERROR in job queue:", updateErr);
                });
        })
        .catch((uploadErr) => {
            console.log("Error in upload request:", uploadErr);
        });
});

jobQueue.on("failed", (error) => {
    console.log(error.data.id, "failed", error.failedReason);
});

const addJobToQueue = async (jobId) => {
    // console.log("Inside JQ 2", jobId);
    await jobQueue.add(jobId);
};

module.exports = {
    addJobToQueue,
};
