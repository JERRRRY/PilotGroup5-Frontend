/**
 * E2E API Test Script for PilotGroup5 Course Management System
 * Tests all 12 APIs defined in MainDesign.md
 *
 * Run: npx tsx e2e-test.ts
 */

const BASE_URL = 'http://localhost:3000/api/v1';

interface TestResult {
  name: string;
  endpoint: string;
  method: string;
  status: 'PASSED' | 'FAILED';
  expected: number;
  actual: number;
  responseTime: number;
  error?: string;
}

const results: TestResult[] = [];
let testCourseId: string | null = null;
let testPageId: string | null = null;
let testResourceId: string | null = null;

// Helper function for API calls
async function apiCall(
  method: string,
  endpoint: string,
  body?: object
): Promise<{ status: number; data: any; time: number }> {
  const start = Date.now();
  const options: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();
    return { status: response.status, data, time: Date.now() - start };
  } catch (error) {
    return { status: 0, data: { error: String(error) }, time: Date.now() - start };
  }
}

// Test runner
async function runTest(
  name: string,
  method: string,
  endpoint: string,
  expectedStatus: number,
  body?: object,
  validate?: (data: any) => boolean
): Promise<boolean> {
  const { status, data, time } = await apiCall(method, endpoint, body);

  const passed = status === expectedStatus && (!validate || validate(data));

  results.push({
    name,
    endpoint: `${method} ${endpoint}`,
    method,
    status: passed ? 'PASSED' : 'FAILED',
    expected: expectedStatus,
    actual: status,
    responseTime: time,
    error: passed ? undefined : JSON.stringify(data).slice(0, 200),
  });

  const icon = passed ? '✅' : '❌';
  console.log(`${icon} ${name}`);
  console.log(`   ${method} ${endpoint}`);
  console.log(`   Status: ${status} (expected: ${expectedStatus}) | Time: ${time}ms`);
  if (!passed) {
    console.log(`   Error: ${JSON.stringify(data).slice(0, 100)}`);
  }
  console.log('');

  return passed;
}

// ==================== TEST CASES ====================

async function testHealthCheck() {
  console.log('\n' + '='.repeat(60));
  console.log('HEALTH CHECK');
  console.log('='.repeat(60));

  try {
    const response = await fetch('http://localhost:3000/health');
    const status = response.status;
    const passed = status === 200;
    results.push({
      name: 'Health Check',
      endpoint: 'GET /health',
      method: 'GET',
      status: passed ? 'PASSED' : 'FAILED',
      expected: 200,
      actual: status,
      responseTime: 0,
    });
    console.log(passed ? '✅ Server is running' : '❌ Server is not responding');
    return passed;
  } catch (error) {
    results.push({
      name: 'Health Check',
      endpoint: 'GET /health',
      method: 'GET',
      status: 'FAILED',
      expected: 200,
      actual: 0,
      responseTime: 0,
      error: String(error),
    });
    console.log('❌ Server is not responding');
    return false;
  }
}

async function testAPI1_GetAllCourses() {
  console.log('\n' + '='.repeat(60));
  console.log('API 1: GET All Courses (Home Page)');
  console.log('='.repeat(60));

  return runTest(
    'Get all courses for homepage',
    'GET',
    '/courses',
    200,
    undefined,
    (data) => Array.isArray(data) && (data.length === 0 || '_id' in data[0])
  );
}

async function testAPI2_GetCourseById() {
  console.log('\n' + '='.repeat(60));
  console.log('API 2: GET Course Details');
  console.log('='.repeat(60));

  // First get a valid course ID
  const { data: courses } = await apiCall('GET', '/courses');
  if (!courses || courses.length === 0) {
    console.log('⚠️  No courses available, skipping test');
    return true;
  }

  const courseId = courses[0]._id;

  await runTest(
    'Get course by valid ID',
    'GET',
    `/courses/${courseId}`,
    200,
    undefined,
    (data) => data._id === courseId && 'pages' in data
  );

  await runTest(
    'Get course with invalid ID format',
    'GET',
    '/courses/invalid-id',
    400
  );

  await runTest(
    'Get non-existent course',
    'GET',
    '/courses/12345678-1234-4123-8123-123456789abc',
    404
  );

  return true;
}

async function testAPI3_CreateCourse() {
  console.log('\n' + '='.repeat(60));
  console.log('API 3: POST Create Course');
  console.log('='.repeat(60));

  // Valid creation
  const validCourse = {
    title: `E2E Test Course - ${Date.now()}`,
    description: 'This is an E2E test course',
    thumbnail: 'https://example.com/thumbnail.jpg',
    category: ['Testing', 'E2E'],
    keywords: ['test', 'e2e', 'automated'],
    published: false,
  };

  const passed = await runTest(
    'Create course with valid data',
    'POST',
    '/courses',
    201,
    validCourse,
    (data) => {
      if (data.data?._id) {
        testCourseId = data.data._id;
        return true;
      }
      return false;
    }
  );

  // Invalid: missing title
  await runTest(
    'Create course without title (should fail)',
    'POST',
    '/courses',
    400,
    { description: 'No title', thumbnail: 'https://example.com/img.jpg' }
  );

  // Invalid: empty body
  await runTest(
    'Create course with empty body (should fail)',
    'POST',
    '/courses',
    400,
    {}
  );

  return passed;
}

async function testAPI4_UpdateCourse() {
  console.log('\n' + '='.repeat(60));
  console.log('API 4: PUT Update Course');
  console.log('='.repeat(60));

  if (!testCourseId) {
    console.log('⚠️  No test course available, skipping');
    return true;
  }

  await runTest(
    'Update course title',
    'PUT',
    `/courses/${testCourseId}`,
    200,
    { title: `Updated E2E Course - ${Date.now()}` },
    (data) => data.message === 'Course updated successfully'
  );

  await runTest(
    'Update non-existent course (should fail)',
    'PUT',
    '/courses/12345678-1234-4123-8123-123456789abc',
    404,
    { title: 'Test' }
  );

  return true;
}

async function testAPI6_GetCMSCourses() {
  console.log('\n' + '='.repeat(60));
  console.log('API 6: GET CMS Courses (Dashboard)');
  console.log('='.repeat(60));

  await runTest(
    'Get CMS courses with pagination',
    'GET',
    '/cms/courses?page=1&limit=10',
    200,
    undefined,
    (data) => 'data' in data && 'pagination' in data
  );

  await runTest(
    'Get CMS courses - published filter',
    'GET',
    '/cms/courses?status=published',
    200
  );

  await runTest(
    'Get CMS courses - draft filter',
    'GET',
    '/cms/courses?status=draft',
    200
  );

  // Legacy endpoint
  await runTest(
    'Get CMS courses (legacy endpoint)',
    'GET',
    '/courses/cms/courses?page=1&limit=5',
    200
  );

  return true;
}

async function testAPI7_AddPage() {
  console.log('\n' + '='.repeat(60));
  console.log('API 7: POST Add Page to Course');
  console.log('='.repeat(60));

  if (!testCourseId) {
    console.log('⚠️  No test course available, skipping');
    return true;
  }

  // Add text page
  await runTest(
    'Add text page',
    'POST',
    `/courses/${testCourseId}/pages`,
    201,
    { order: 1, type: 'text', title: 'Text Page', textContent: 'Content here' },
    (data) => {
      if (data.data?._id) {
        testPageId = data.data._id;
        return true;
      }
      return false;
    }
  );

  // Add video page
  await runTest(
    'Add video page',
    'POST',
    `/courses/${testCourseId}/pages`,
    201,
    { order: 2, type: 'video', title: 'Video Page', videoUrls: ['https://example.com/video.mp4'] }
  );

  // Add quiz page
  await runTest(
    'Add quiz page',
    'POST',
    `/courses/${testCourseId}/pages`,
    201,
    {
      order: 3,
      type: 'quiz',
      title: 'Quiz Page',
      quizData: [{ question: 'Test?', options: ['A', 'B'], correctAnswerIndex: 0 }],
    }
  );

  // Add image page
  await runTest(
    'Add image page',
    'POST',
    `/courses/${testCourseId}/pages`,
    201,
    { order: 4, type: 'image', title: 'Image Page', images: [{ url: 'https://example.com/img.jpg', caption: 'Test' }] }
  );

  // Invalid: negative order
  await runTest(
    'Add page with negative order (should fail)',
    'POST',
    `/courses/${testCourseId}/pages`,
    400,
    { order: -1, type: 'text', title: 'Invalid' }
  );

  // Invalid: invalid type
  await runTest(
    'Add page with invalid type (should fail)',
    'POST',
    `/courses/${testCourseId}/pages`,
    400,
    { order: 1, type: 'invalid', title: 'Invalid' }
  );

  // Add to non-existent course
  await runTest(
    'Add page to non-existent course (should fail)',
    'POST',
    '/courses/12345678-1234-4123-8123-123456789abc/pages',
    404,
    { order: 1, type: 'text', title: 'Test' }
  );

  return true;
}

async function testAPI8_UpdatePage() {
  console.log('\n' + '='.repeat(60));
  console.log('API 8: PUT Update Page');
  console.log('='.repeat(60));

  if (!testCourseId || !testPageId) {
    console.log('⚠️  No test course/page available, skipping');
    return true;
  }

  await runTest(
    'Update page content',
    'PUT',
    `/courses/${testCourseId}/pages/${testPageId}`,
    200,
    { title: 'Updated Page Title', textContent: 'Updated content' },
    (data) => data.message === 'Page updated successfully'
  );

  return true;
}

async function testAPI10_PublishCourse() {
  console.log('\n' + '='.repeat(60));
  console.log('API 10: PUT Publish/Unpublish Course');
  console.log('='.repeat(60));

  if (!testCourseId) {
    console.log('⚠️  No test course available, skipping');
    return true;
  }

  await runTest(
    'Publish course',
    'PUT',
    `/courses/${testCourseId}/publish`,
    200,
    { published: true },
    (data) => data.data?.published === true
  );

  await runTest(
    'Unpublish course',
    'PUT',
    `/courses/${testCourseId}/publish`,
    200,
    { published: false },
    (data) => data.data?.published === false
  );

  await runTest(
    'Publish with invalid data (should fail)',
    'PUT',
    `/courses/${testCourseId}/publish`,
    400,
    { published: 'not-boolean' }
  );

  return true;
}

async function testAPI11_UploadResource() {
  console.log('\n' + '='.repeat(60));
  console.log('API 11: POST Upload Resource');
  console.log('='.repeat(60));

  if (!testCourseId) {
    console.log('⚠️  No test course available, skipping');
    return true;
  }

  await runTest(
    'Upload resource',
    'POST',
    `/courses/${testCourseId}/resources`,
    201,
    { fileName: 'test-doc.pdf', fileUrl: 'https://example.com/test-doc.pdf' },
    (data) => {
      if (data.data?._id) {
        testResourceId = data.data._id;
        return true;
      }
      return false;
    }
  );

  await runTest(
    'Upload resource with empty fields (should fail)',
    'POST',
    `/courses/${testCourseId}/resources`,
    400,
    { fileName: '', fileUrl: '' }
  );

  return true;
}

async function testAPI12_DeleteResource() {
  console.log('\n' + '='.repeat(60));
  console.log('API 12: DELETE Resource');
  console.log('='.repeat(60));

  if (!testCourseId || !testResourceId) {
    console.log('⚠️  No test resource available, skipping');
    return true;
  }

  await runTest(
    'Delete resource',
    'DELETE',
    `/courses/${testCourseId}/resources/${testResourceId}`,
    200,
    undefined,
    (data) => data.message === 'Resource deleted successfully'
  );

  return true;
}

async function testAPI9_DeletePage() {
  console.log('\n' + '='.repeat(60));
  console.log('API 9: DELETE Page');
  console.log('='.repeat(60));

  if (!testCourseId || !testPageId) {
    console.log('⚠️  No test page available, skipping');
    return true;
  }

  await runTest(
    'Delete page',
    'DELETE',
    `/courses/${testCourseId}/pages/${testPageId}`,
    200,
    undefined,
    (data) => data.message === 'Page deleted successfully'
  );

  return true;
}

async function testAPI5_DeleteCourse() {
  console.log('\n' + '='.repeat(60));
  console.log('API 5: DELETE Course (Cleanup)');
  console.log('='.repeat(60));

  if (!testCourseId) {
    console.log('⚠️  No test course available, skipping');
    return true;
  }

  await runTest(
    'Delete course',
    'DELETE',
    `/courses/${testCourseId}`,
    200,
    undefined,
    (data) => data.message === 'Course deleted successfully'
  );

  await runTest(
    'Verify course deleted',
    'GET',
    `/courses/${testCourseId}`,
    404
  );

  await runTest(
    'Delete non-existent course (should fail)',
    'DELETE',
    '/courses/12345678-1234-4123-8123-123456789abc',
    404
  );

  return true;
}

// ==================== MAIN ====================

async function main() {
  console.log('\n');
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║         PilotGroup5 E2E API Test Suite                       ║');
  console.log('║         Course Management System                             ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log('\n');

  const startTime = Date.now();

  // Run all tests in order
  await testHealthCheck();
  await testAPI1_GetAllCourses();
  await testAPI2_GetCourseById();
  await testAPI3_CreateCourse();
  await testAPI4_UpdateCourse();
  await testAPI6_GetCMSCourses();
  await testAPI7_AddPage();
  await testAPI8_UpdatePage();
  await testAPI10_PublishCourse();
  await testAPI11_UploadResource();
  await testAPI12_DeleteResource();
  await testAPI9_DeletePage();
  await testAPI5_DeleteCourse();

  const totalTime = Date.now() - startTime;

  // Print summary
  console.log('\n');
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║                      TEST SUMMARY                            ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');

  const passed = results.filter((r) => r.status === 'PASSED').length;
  const failed = results.filter((r) => r.status === 'FAILED').length;
  const total = results.length;
  const passRate = ((passed / total) * 100).toFixed(1);

  console.log(`\nTotal Tests:    ${total}`);
  console.log(`Passed:         ${passed} ✅`);
  console.log(`Failed:         ${failed} ❌`);
  console.log(`Pass Rate:      ${passRate}%`);
  console.log(`Total Time:     ${totalTime}ms`);

  if (failed > 0) {
    console.log('\n❌ FAILED TESTS:');
    results
      .filter((r) => r.status === 'FAILED')
      .forEach((r) => {
        console.log(`  - ${r.name}`);
        console.log(`    ${r.endpoint}`);
        console.log(`    Expected: ${r.expected}, Got: ${r.actual}`);
        if (r.error) console.log(`    Error: ${r.error}`);
      });
  }

  console.log('\n');
  if (failed === 0) {
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║              ✅ ALL TESTS PASSED!                            ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');
  } else {
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║              ❌ SOME TESTS FAILED                            ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');
  }

  process.exit(failed > 0 ? 1 : 0);
}

main().catch(console.error);
