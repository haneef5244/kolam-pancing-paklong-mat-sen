const { BlobServiceClient, BlobSASPermissions, generateBlobSASQueryParameters, StorageSharedKeyCredential, SASProtocol } = require('@azure/storage-blob');
const { Buffer } = require('buffer');

export const uploadBase64ImageToBlob = async (blobName, containerName, base64Image) => {
    // Create a BlobServiceClient
    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);

    // Get a reference to a container
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Convert base64 string to buffer (removing the base64 prefix if needed)
    const base64Data = base64Image.replace(/^data:image\/png;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');

    // Get a block blob client
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Upload the buffer to Azure Blob Storage
    await blockBlobClient.uploadData(buffer, {
        blobHTTPHeaders: { blobContentType: "image/png" } // Ensure the correct content type
    });

    console.log(`Upload successful: ${blobName}`);
}

export const getBlobSasUrl = (blobName, containerName, expiryDate) => {
    // Create a shared key credential
    const sharedKeyCredential = new StorageSharedKeyCredential(process.env.AZURE_STORAGE_ACCOUNT_NAME, process.env.AZURE_STORAGE_ACCOUNT_KEY);

    // Create a BlobServiceClient object
    const blobServiceClient = new BlobServiceClient(
        `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
        sharedKeyCredential
    );

    // Parameters
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Generate SAS token
    const sasToken = generateBlobSASQueryParameters({
        containerName,
        blobName,
        permissions: BlobSASPermissions.parse("r"), // "r" for read permission
        startsOn: new Date(), // Optionally, set a start time
        expiresOn: expiryDate,
        protocol: SASProtocol.Https, // Optional: HTTPS only
    }, sharedKeyCredential).toString();

    // Construct the SAS URL
    const containerUrl = containerClient.getBlobClient(blobName).url
    const sasUrl = `${containerUrl}?${sasToken}`;
    return sasUrl;
}