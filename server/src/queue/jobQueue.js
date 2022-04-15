const { default: axios } = require("axios");
const Queue = require("bull");
const jobQueue = new Queue("job-queue");
const NUM_WORKERS = 5;

// Upload images
jobQueue.process(NUM_WORKERS, async ({ data }) => {
    console.log("Inside JQ", data);

    let { jobId, menuId, images, existingImages = [], authHeader } = data;
    axios
        .post("http://localhost:5001/upload/bucket", {
            files: images,
            location: "/items",
            existingImages: existingImages,
        }, {
            headers: {
                authorization: authHeader
            }
        })
        .then((uploadResp) => {
            console.log("Upload resp", uploadResp.data);

            axios
                .put(`http://localhost:5001/menu/edit/${menuId}`, {
                    images: uploadResp.data.fileURLs,
                }, {
                    headers: {
                        authorization: authHeader
                    }
                })
                .then((updateResp) => {
                    console.log("Update resp in job queue:", updateResp.data);
                })
                .catch((updateErr) => {
                    console.error("Update ERROR in job queue:", updateErr);
                });
        })
        .catch((uploadErr) => {
            console.error("Error in upload request:", uploadErr);
        });
});

jobQueue.on("failed", (error) => {
    console.error(error.data.id, "failed", error.failedReason);
});

const addJobToQueue = async (jobId) => {
    await jobQueue.add(jobId);
};

module.exports = {
    addJobToQueue,
};
