import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { HitCounter } from './hitcounter';


export class CdkWorkshopStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
  
      // add lamba code
      const myfunc = new lambda.Function(this, 'HelloHandler', {
          runtime: lambda.Runtime.NODEJS_16_X,  
          code: lambda.Code.fromAsset('./functions'),
          handler: 'hello.handler'
      });
      

    new apigateway.LambdaRestApi(this, 'LambdaProxy', {
      handler: myfunc
    });

    const hitcounter = new HitCounter(
      this, 
      'HelloHitCounter', {
          downstream: myfunc
      }
  );
                        
  new apigateway.LambdaRestApi(this, 'Endpoint', {
      handler: hitcounter.handler
  });

  }
}