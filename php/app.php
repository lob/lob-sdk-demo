<?php
require __DIR__ . '/vendor/autoload.php';

use OpenAPI\Client\Api\AddressesApi;
use \OpenAPI\Client\Model\AddressEditable;
use OpenAPI\Client\Configuration;
use GuzzleHttp\Client;

$config = new Configuration();
$config->setApiKey('basic', getenv('LOB_API_TEST_KEY'));
$addressApi = new AddressesApi($config);

$apiInstance = new AddressesApi($config);
$addressEditable = new AddressEditable();

$addressEditable = new AddressEditable();
$addressEditable->setName("THING T. THING");
$addressEditable->setAddressLine1("1313 CEMETERY LN");
$addressEditable->setAddressCity("WESTFIELD");
$addressEditable->setAddressState("NJ");
$addressEditable->setAddressZip("07000");

$createdAddress = $addressApi->create($addressEditable);

print("\nCREATED ADDRESS:\n");
print_r($createdAddress);
print("\nCREATED ADDRESS:\n");
?>