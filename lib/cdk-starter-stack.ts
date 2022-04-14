import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';

export class CdkStarterStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 👇 Create Permissions Boundary
    const boundary1 = new iam.ManagedPolicy(this, 'permissions-boundary-1', {
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.DENY,
          actions: ['sqs:*'],
          resources: ['*'],
        }),
      ],
    });

    // 👇 Create role and attach the permissions boundary
    const role = new iam.Role(this, 'example-iam-role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      description: 'An example IAM role in AWS CDK',
      permissionsBoundary: boundary1,
    });

    console.log(
      'role boundary arn 👉',
      role.permissionsBoundary?.managedPolicyArn,
    );

    // 👇 Create a user, to which we will attach the boundary
    const user = new iam.User(this, 'example-user');

    // 👇 attach the permissions boundary to the user
    iam.PermissionsBoundary.of(user).apply(boundary1);

    // 👇 Add Policy Statements to the Permissions Boundary
    boundary1.addStatements(
      new iam.PolicyStatement({
        effect: iam.Effect.DENY,
        actions: ['kinesis:*'],
        resources: ['*'],
      }),
    );

    // 👇 Used to import an already existing Permissions Boundary
    // const externalBoundary = iam.ManagedPolicy.fromManagedPolicyName(
    //   this,
    //   'external-boundary',
    //   'YOUR_EXISTING_BOUNDARY',
    // );

    // 👇 attach the external permissions boundary to the role
    // iam.PermissionsBoundary.of(role).apply(externalBoundary);

    // 👇 attaching a second permissions boundary to a role replaces the first
    // const boundary2 = new iam.ManagedPolicy(this, 'permissions-boundary-2', {
    //   statements: [
    //     new iam.PolicyStatement({
    //       effect: iam.Effect.DENY,
    //       actions: ['ses:*'],
    //       resources: ['*'],
    //     }),
    //   ],
    // });

    // iam.PermissionsBoundary.of(user).apply(boundary2);

    // 👇 remove the permission boundary from the User
    // iam.PermissionsBoundary.of(user).clear();
  }
}
