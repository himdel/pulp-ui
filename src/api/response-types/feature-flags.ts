export class FeatureFlagsType {
  // containers
  container_signing: boolean;
  execution_environments: boolean;

  // keycloak
  external_authentication: boolean;

  // community mode
  display_repositories: boolean;

  // collection signing
  can_create_signatures: boolean;
  can_upload_signatures: boolean;
  collection_auto_sign: boolean;
  collection_signing: boolean;
  display_signatures: boolean;
  require_upload_signatures: boolean;
  signatures_enabled: boolean;

  // errors
  _messages: string[];
}
