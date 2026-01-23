#!/bin/bash

# API Test Script for PilotGroup5 Course Management System
# This script tests all API endpoints

BASE_URL="http://localhost:3000/api/v1"
PASSED=0
FAILED=0
TOTAL=0

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Test helper function
run_test() {
    local method=$1
    local endpoint=$2
    local data=$3
    local expected_status=$4
    local description=$5

    TOTAL=$((TOTAL + 1))

    echo -e "\n${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}Test #$TOTAL: $description${NC}"
    echo -e "${BLUE}$method $endpoint${NC}"

    if [ -z "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" "${BASE_URL}${endpoint}" 2>/dev/null)
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" "${BASE_URL}${endpoint}" \
            -H "Content-Type: application/json" \
            -d "$data" 2>/dev/null)
    fi

    # Extract status code (last line) and body (everything else)
    status_code=$(echo "$response" | tail -n 1)
    body=$(echo "$response" | sed '$d')

    if [ "$status_code" = "$expected_status" ]; then
        echo -e "${GREEN}✓ PASSED${NC} - Status: $status_code (expected: $expected_status)"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}✗ FAILED${NC} - Status: $status_code (expected: $expected_status)"
        FAILED=$((FAILED + 1))
    fi

    # Pretty print JSON if possible
    if command -v jq &> /dev/null; then
        echo -e "${BLUE}Response:${NC}"
        echo "$body" | jq '.' 2>/dev/null || echo "$body"
    else
        echo -e "${BLUE}Response:${NC} $body"
    fi

    # Store body for extraction
    LAST_RESPONSE="$body"
}

echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║       PilotGroup5 API Test Suite                             ║"
echo "║       Course Management System                               ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# ========== HEALTH CHECK ==========
echo -e "\n${YELLOW}========== HEALTH CHECK ==========${NC}"

TOTAL=$((TOTAL + 1))
echo -e "\n${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}Test #$TOTAL: Server health check${NC}"
health_response=$(curl -s -w "\n%{http_code}" http://localhost:3000/health 2>/dev/null)
health_status=$(echo "$health_response" | tail -n 1)
health_body=$(echo "$health_response" | sed '$d')

if [ "$health_status" = "200" ]; then
    echo -e "${GREEN}✓ PASSED${NC} - Status: $health_status"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}✗ FAILED${NC} - Status: $health_status (expected: 200)"
    FAILED=$((FAILED + 1))
fi
echo "$health_body" | jq '.' 2>/dev/null || echo "$health_body"

# ========== COURSE RETRIEVAL TESTS ==========
echo -e "\n${YELLOW}========== COURSE RETRIEVAL TESTS ==========${NC}"

run_test "GET" "/courses" "" "200" "Get all courses (Student homepage)"

# MainDesign.md specifies /cms/courses - now correctly implemented
run_test "GET" "/cms/courses?page=1&limit=10" "" "200" "Get CMS courses with pagination (MainDesign spec)"

run_test "GET" "/cms/courses?status=published" "" "200" "Get CMS courses - published only"

run_test "GET" "/cms/courses?status=draft" "" "200" "Get CMS courses - drafts only"

# Legacy endpoint (backward compatibility)
run_test "GET" "/courses/cms/courses?page=1&limit=5" "" "200" "Get CMS courses (legacy endpoint)"

# ========== COURSE CREATION TESTS ==========
echo -e "\n${YELLOW}========== COURSE CREATION TESTS ==========${NC}"

CREATE_DATA='{
    "title": "API Test Course - '"$(date +%s)"'",
    "description": "This is a test course created by the API test script",
    "thumbnail": "https://example.com/test-thumbnail.jpg",
    "category": ["Technology", "Testing"],
    "keywords": ["api", "test", "automation"],
    "published": false
}'

run_test "POST" "/courses" "$CREATE_DATA" "201" "Create a new course"

# Extract course ID
COURSE_ID=$(echo "$LAST_RESPONSE" | jq -r '.data._id // .data.courseId // ._id // .courseId' 2>/dev/null)
echo -e "${BLUE}Created Course ID: $COURSE_ID${NC}"

if [ -z "$COURSE_ID" ] || [ "$COURSE_ID" = "null" ]; then
    echo -e "${RED}Warning: Could not extract course ID. Trying to get from existing courses...${NC}"
    existing=$(curl -s "${BASE_URL}/courses" 2>/dev/null)
    COURSE_ID=$(echo "$existing" | jq -r '.[0]._id // .[0].courseId' 2>/dev/null)
    echo -e "${YELLOW}Using existing course ID: $COURSE_ID${NC}"
fi

# Validation tests
run_test "POST" "/courses" '{"title": ""}' "400" "Create course with empty title (should fail)"

run_test "POST" "/courses" '{"description": "No title"}' "400" "Create course without title (should fail)"

run_test "POST" "/courses" '{}' "400" "Create course with empty body (should fail)"

# ========== SINGLE COURSE TESTS ==========
echo -e "\n${YELLOW}========== SINGLE COURSE TESTS ==========${NC}"

if [ -n "$COURSE_ID" ] && [ "$COURSE_ID" != "null" ]; then
    run_test "GET" "/courses/$COURSE_ID" "" "200" "Get course by ID"
fi

run_test "GET" "/courses/invalid-id-12345" "" "400" "Get course with invalid ID format (should fail)"

# Use valid UUID v4 format for non-existent course test
run_test "GET" "/courses/12345678-1234-4123-8123-123456789abc" "" "404" "Get non-existent course (should return 404)"

# ========== COURSE UPDATE TESTS ==========
echo -e "\n${YELLOW}========== COURSE UPDATE TESTS ==========${NC}"

if [ -n "$COURSE_ID" ] && [ "$COURSE_ID" != "null" ]; then
    UPDATE_DATA='{
        "title": "Updated API Test Course - '"$(date +%s)"'",
        "description": "This course has been updated by the API test script"
    }'
    run_test "PUT" "/courses/$COURSE_ID" "$UPDATE_DATA" "200" "Update course title and description"

    UPDATE_FULL='{
        "title": "Fully Updated Course",
        "description": "Full update test",
        "thumbnail": "https://example.com/new-thumb.jpg",
        "category": ["Updated Category"],
        "keywords": ["updated", "full"]
    }'
    run_test "PUT" "/courses/$COURSE_ID" "$UPDATE_FULL" "200" "Update all course fields"
fi

# ========== PUBLISH/UNPUBLISH TESTS ==========
echo -e "\n${YELLOW}========== PUBLISH/UNPUBLISH TESTS ==========${NC}"

if [ -n "$COURSE_ID" ] && [ "$COURSE_ID" != "null" ]; then
    run_test "PUT" "/courses/$COURSE_ID/publish" '{"published": true}' "200" "Publish course"

    run_test "PUT" "/courses/$COURSE_ID/publish" '{"published": false}' "200" "Unpublish course"

    run_test "PUT" "/courses/$COURSE_ID/publish" '{"published": "not-a-boolean"}' "400" "Publish with invalid data (should fail)"

    run_test "PUT" "/courses/$COURSE_ID/publish" '{}' "400" "Publish without published field (should fail)"
fi

# ========== PAGE MANAGEMENT TESTS ==========
echo -e "\n${YELLOW}========== PAGE MANAGEMENT TESTS ==========${NC}"

if [ -n "$COURSE_ID" ] && [ "$COURSE_ID" != "null" ]; then
    # Add text page
    TEXT_PAGE='{
        "order": 1,
        "type": "text",
        "title": "Test Text Page - Introduction",
        "textContent": "This is a test text page created by the API test script."
    }'
    run_test "POST" "/courses/$COURSE_ID/pages" "$TEXT_PAGE" "201" "Add text page to course"

    PAGE_ID=$(echo "$LAST_RESPONSE" | jq -r '.data._id // .data.pageId' 2>/dev/null)
    echo -e "${BLUE}Created Page ID: $PAGE_ID${NC}"

    # Add video page
    VIDEO_PAGE='{
        "order": 2,
        "type": "video",
        "title": "Test Video Page",
        "videoUrls": ["https://example.com/video1.mp4", "https://example.com/video2.mp4"]
    }'
    run_test "POST" "/courses/$COURSE_ID/pages" "$VIDEO_PAGE" "201" "Add video page to course"

    VIDEO_PAGE_ID=$(echo "$LAST_RESPONSE" | jq -r '.data._id // .data.pageId' 2>/dev/null)

    # Add quiz page
    QUIZ_PAGE='{
        "order": 3,
        "type": "quiz",
        "title": "Test Quiz Page",
        "quizData": [
            {
                "question": "What is 2 + 2?",
                "options": ["3", "4", "5", "6"],
                "correctAnswerIndex": 1
            },
            {
                "question": "Which is a JavaScript framework?",
                "options": ["Django", "Flask", "React", "Laravel"],
                "correctAnswerIndex": 2
            }
        ]
    }'
    run_test "POST" "/courses/$COURSE_ID/pages" "$QUIZ_PAGE" "201" "Add quiz page to course"

    # Add image page
    IMAGE_PAGE='{
        "order": 4,
        "type": "image",
        "title": "Test Image Page",
        "images": [
            {"url": "https://example.com/image1.jpg", "caption": "Image 1"},
            {"url": "https://example.com/image2.jpg", "caption": "Image 2"}
        ]
    }'
    run_test "POST" "/courses/$COURSE_ID/pages" "$IMAGE_PAGE" "201" "Add image page to course"

    # Invalid page tests
    run_test "POST" "/courses/$COURSE_ID/pages" '{"order": -1, "type": "text", "title": "Invalid"}' "400" "Add page with negative order (should fail)"

    run_test "POST" "/courses/$COURSE_ID/pages" '{"order": 1, "type": "invalid", "title": "Test"}' "400" "Add page with invalid type (should fail)"

    run_test "POST" "/courses/$COURSE_ID/pages" '{"order": 1, "type": "text", "title": ""}' "400" "Add page with empty title (should fail)"

    # Update page
    if [ -n "$PAGE_ID" ] && [ "$PAGE_ID" != "null" ]; then
        UPDATE_PAGE='{
            "title": "Updated Text Page Title",
            "textContent": "This content has been updated."
        }'
        run_test "PUT" "/courses/$COURSE_ID/pages/$PAGE_ID" "$UPDATE_PAGE" "200" "Update page content"
    fi
fi

# ========== RESOURCE MANAGEMENT TESTS ==========
echo -e "\n${YELLOW}========== RESOURCE MANAGEMENT TESTS ==========${NC}"

if [ -n "$COURSE_ID" ] && [ "$COURSE_ID" != "null" ]; then
    RESOURCE_DATA='{
        "fileName": "test-document.pdf",
        "fileUrl": "https://example.com/test-document.pdf"
    }'
    run_test "POST" "/courses/$COURSE_ID/resources" "$RESOURCE_DATA" "201" "Add resource to course"

    RESOURCE_ID=$(echo "$LAST_RESPONSE" | jq -r '.data._id // .data.resourceId' 2>/dev/null)
    echo -e "${BLUE}Created Resource ID: $RESOURCE_ID${NC}"

    # Add another resource
    RESOURCE_DATA2='{
        "fileName": "course-slides.pptx",
        "fileUrl": "https://example.com/course-slides.pptx"
    }'
    run_test "POST" "/courses/$COURSE_ID/resources" "$RESOURCE_DATA2" "201" "Add second resource to course"

    # Invalid resource tests
    run_test "POST" "/courses/$COURSE_ID/resources" '{"fileName": "", "fileUrl": ""}' "400" "Add resource with empty fields (should fail)"

    run_test "POST" "/courses/$COURSE_ID/resources" '{"fileName": "test.pdf"}' "400" "Add resource without fileUrl (should fail)"

    # Delete resource
    if [ -n "$RESOURCE_ID" ] && [ "$RESOURCE_ID" != "null" ]; then
        run_test "DELETE" "/courses/$COURSE_ID/resources/$RESOURCE_ID" "" "200" "Delete resource"
    fi
fi

# ========== CLEANUP TESTS ==========
echo -e "\n${YELLOW}========== CLEANUP TESTS ==========${NC}"

if [ -n "$COURSE_ID" ] && [ "$COURSE_ID" != "null" ]; then
    # Delete pages first
    if [ -n "$PAGE_ID" ] && [ "$PAGE_ID" != "null" ]; then
        run_test "DELETE" "/courses/$COURSE_ID/pages/$PAGE_ID" "" "200" "Delete text page"
    fi

    if [ -n "$VIDEO_PAGE_ID" ] && [ "$VIDEO_PAGE_ID" != "null" ]; then
        run_test "DELETE" "/courses/$COURSE_ID/pages/$VIDEO_PAGE_ID" "" "200" "Delete video page"
    fi

    # Delete course
    run_test "DELETE" "/courses/$COURSE_ID" "" "200" "Delete test course (cleanup)"

    # Verify deletion
    run_test "GET" "/courses/$COURSE_ID" "" "404" "Verify course deleted (should return 404)"
fi

# ========== ERROR HANDLING TESTS ==========
echo -e "\n${YELLOW}========== ERROR HANDLING TESTS ==========${NC}"

run_test "DELETE" "/courses/12345678-1234-4123-8123-123456789abc" "" "404" "Delete non-existent course"

run_test "PUT" "/courses/12345678-1234-4123-8123-123456789abc" '{"title": "Test"}' "404" "Update non-existent course"

run_test "POST" "/courses/12345678-1234-4123-8123-123456789abc/pages" '{"order": 1, "type": "text", "title": "Test"}' "404" "Add page to non-existent course"

# ========== SUMMARY ==========
echo -e "\n${BLUE}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    TEST SUMMARY                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

PASS_RATE=$(echo "scale=1; $PASSED * 100 / $TOTAL" | bc 2>/dev/null || echo "N/A")

echo -e "Total Tests:  ${BLUE}$TOTAL${NC}"
echo -e "Passed:       ${GREEN}$PASSED${NC}"
echo -e "Failed:       ${RED}$FAILED${NC}"
echo -e "Pass Rate:    ${CYAN}${PASS_RATE}%${NC}"

echo ""
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║              ✓ ALL TESTS PASSED!                             ║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
    exit 0
else
    echo -e "${RED}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║              ✗ SOME TESTS FAILED                             ║${NC}"
    echo -e "${RED}╚══════════════════════════════════════════════════════════════╝${NC}"
    exit 1
fi
