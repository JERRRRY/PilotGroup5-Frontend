import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, QueryCommand, ScanCommand, PutCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
});

export const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: true,
  },
});

export const COURSES_TABLE = process.env.DYNAMODB_TABLE_NAME || 'Courses';

// Helper functions for common operations
export async function getCourseById(courseId: string) {
  const command = new GetCommand({
    TableName: COURSES_TABLE,
    Key: { courseId },
  });
  return docClient.send(command);
}

export async function getAllCourses() {
  const command = new ScanCommand({
    TableName: COURSES_TABLE,
  });
  return docClient.send(command);
}

export async function getCoursesByPublished(published: string, limit?: number) {
  const command = new QueryCommand({
    TableName: COURSES_TABLE,
    IndexName: 'published-createdAt-index',
    KeyConditionExpression: 'published = :published',
    ExpressionAttributeValues: {
      ':published': published, // 'true' or 'false' as string
    },
    ScanIndexForward: false, // Sort by createdAt descending
    Limit: limit,
  });
  return docClient.send(command);
}

export async function createCourse(courseData: any) {
  const command = new PutCommand({
    TableName: COURSES_TABLE,
    Item: courseData,
  });
  return docClient.send(command);
}

export async function updateCourse(courseId: string, updateData: any) {
  const updateExpressions: string[] = [];
  const expressionAttributeValues: Record<string, any> = {};
  let counter = 0;

  for (const [key, value] of Object.entries(updateData)) {
    if (key !== 'courseId') {
      const placeholder = `:val${counter}`;
      updateExpressions.push(`${key} = ${placeholder}`);
      expressionAttributeValues[placeholder] = value;
      counter++;
    }
  }

  if (updateExpressions.length === 0) {
    throw new Error('No fields to update');
  }

  const command = new UpdateCommand({
    TableName: COURSES_TABLE,
    Key: { courseId },
    UpdateExpression: `SET ${updateExpressions.join(', ')}`,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'ALL_NEW',
  });
  return docClient.send(command);
}

export async function deleteCourse(courseId: string) {
  const command = new DeleteCommand({
    TableName: COURSES_TABLE,
    Key: { courseId },
  });
  return docClient.send(command);
}
