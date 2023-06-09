import { Construct } from 'constructs';
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb"

export interface HitCounterProps {
    downstream: lambda.IFunction;
}
export class HitCounter extends Construct {
    public handler: lambda.Function

    constructor(
        scope: Construct, id: string, props: HitCounterProps
    ) {
        super(scope, id);

        const table = new dynamodb.Table(this, "Hits", {
            partitionKey: {
                name: 'path',
                type: dynamodb.AttributeType.STRING
            }
        })

        this.handler = new lambda.Function(this, 'HitCounterHandler', {
            runtime: lambda.Runtime.NODEJS_14_X,
            handler: 'hitCounter.handler',
            code: lambda.Code.fromAsset('functions'),
            environment: {
                DOWNSTREAM_FUNCTION_NAME: props.downstream.functionName,
                HITS_TABLE_NAME: table.tableName // late bound values
            }
        });

        table.grantReadWriteData(this.handler);
        props.downstream.grantInvoke(this.handler)
    }
}