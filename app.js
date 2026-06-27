const USERS = [
  { id: "admin", password: "2026", role: "admin", name: "관리자" },
  { id: "10101", password: "1234", role: "student", studentId: "10101" },
  { id: "10102", password: "1234", role: "student", studentId: "10102" },
  { id: "10103", password: "1234", role: "student", studentId: "10103" },
];

const STUDENTS = [
  {
    id: "10101",
    name: "김코딩",
    photo: "assets/10101_김코딩.jpg",
    grades: {
      "정보 수행평가": "A",
      "웹앱 프로젝트": "92점",
      "디지털 윤리 퀴즈": "88점",
      "수업 참여도": "상",
    },
    traits: [
      "문제 해결 과정을 차분히 설명합니다.",
      "새 도구를 시도할 때 기록을 꼼꼼히 남깁니다.",
      "제출 전 확인 습관을 더 연습하면 좋습니다.",
    ],
    teacherMemo: "프론트엔드 구조 이해가 빠르며, 팀원 질문에 답하는 태도가 좋습니다.",
  },
  {
    id: "10102",
    name: "박개발",
    photo: "assets/10102_박개발.jpg",
    grades: {
      "정보 수행평가": "B+",
      "웹앱 프로젝트": "86점",
      "디지털 윤리 퀴즈": "91점",
      "수업 참여도": "중상",
    },
    traits: [
      "협업 중 역할 분담을 잘 지킵니다.",
      "UI 수정 아이디어를 자주 제안합니다.",
      "프로젝트 범위를 작게 나누는 연습이 필요합니다.",
    ],
    teacherMemo: "기능 구현 의욕이 높고, 오류가 날 때 원인을 함께 추적하려는 태도가 좋습니다.",
  },
  {
    id: "10103",
    name: "이교사",
    photo: "assets/10103_이교사.jpg",
    grades: {
      "정보 수행평가": "A-",
      "웹앱 프로젝트": "89점",
      "디지털 윤리 퀴즈": "95점",
      "수업 참여도": "상",
    },
    traits: [
      "학습 내용을 자기 언어로 정리합니다.",
      "개선할 지점을 발견하면 근거를 함께 제시합니다.",
      "코드 주석을 더 구체적으로 쓰면 좋습니다.",
    ],
    teacherMemo: "질문의 초점이 좋고, 개선 방향을 토의하는 데 적극적입니다.",
  },
];

const loginForm = document.querySelector("#loginForm");
const userIdInput = document.querySelector("#userId");
const passwordInput = document.querySelector("#password");
const loginMessage = document.querySelector("#loginMessage");
const logoutButton = document.querySelector("#logoutButton");
const loginView = document.querySelector("#loginView");
const studentView = document.querySelector("#studentView");
const adminView = document.querySelector("#adminView");

let currentUser = null;

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const id = userIdInput.value.trim();
  const password = passwordInput.value;
  const user = USERS.find((item) => item.id === id && item.password === password);

  if (!user) {
    loginMessage.textContent = "아이디 또는 비밀번호가 올바르지 않습니다.";
    passwordInput.value = "";
    passwordInput.focus();
    return;
  }

  currentUser = user;
  loginMessage.textContent = "";
  loginForm.reset();

  if (user.role === "admin") {
    renderAdminDashboard();
  } else {
    const student = STUDENTS.find((item) => item.id === user.studentId);
    renderStudentPage(student);
  }
});

logoutButton.addEventListener("click", () => {
  currentUser = null;
  showOnly(loginView);
  logoutButton.classList.add("hidden");
  userIdInput.focus();
});

function showOnly(targetView) {
  [loginView, studentView, adminView].forEach((view) => view.classList.add("hidden"));
  targetView.classList.remove("hidden");
}

function renderStudentPage(student) {
  if (!student) {
    loginMessage.textContent = "학생 정보를 찾을 수 없습니다.";
    showOnly(loginView);
    return;
  }

  studentView.innerHTML = `
    <div class="view-header">
      <div class="view-title">
        <p class="eyebrow">Student</p>
        <h2>${student.name} 학생 페이지</h2>
        <p>로그인한 학생의 학습 현황을 확인합니다.</p>
      </div>
    </div>

    <div class="student-layout">
      <article class="student-profile">
        <img class="student-photo" src="${student.photo}" alt="${student.name} 학생 사진" />
        <div class="profile-body">
          <h3>${student.name}</h3>
          <p class="student-number">학번 ${student.id}</p>
          <div class="tag-row" aria-label="학습 키워드">
            <span class="tag">정보</span>
            <span class="tag">프로젝트</span>
          </div>
        </div>
      </article>

      <div class="content-stack">
        ${renderGrades(student.grades, false, `gradesTitle-${student.id}`)}
        ${renderTraits(student)}
      </div>
    </div>
  `;

  showOnly(studentView);
  logoutButton.classList.remove("hidden");
}

function renderAdminDashboard() {
  adminView.innerHTML = `
    <div class="view-header">
      <div class="view-title">
        <p class="eyebrow">Admin</p>
        <h2>관리자 대시보드</h2>
        <p>학생 3명의 학습 현황을 한 화면에서 비교합니다.</p>
      </div>
    </div>

    <section class="admin-grid" aria-label="전체 학생 정보">
      ${STUDENTS.map(renderStudentCard).join("")}
    </section>

    <div id="counselingPanelContainer" style="margin-top: 40px;"></div>
  `;

  showOnly(adminView);
  logoutButton.classList.remove("hidden");
}

function renderStudentCard(student) {
  return `
    <article class="student-card">
      <img class="student-photo" src="${student.photo}" alt="${student.name} 학생 사진" />
      <div class="student-card-body">
        <h3>${student.name}</h3>
        <p class="student-number">학번 ${student.id}</p>
        ${renderGrades(student.grades, true, `gradesTitle-${student.id}`)}
        ${renderTraits(student)}
        <button class="primary-button" style="width: 100%; margin-top: 15px;" onclick="openCounselingPanel('${student.id}')">상담 전략 요청</button>
      </div>
    </article>
  `;
}

function renderGrades(grades, compact = false, headingId = "gradesTitle") {
  const rows = Object.entries(grades)
    .map(([label, value]) => `<tr><th scope="row">${label}</th><td>${value}</td></tr>`)
    .join("");

  return `
    <section aria-labelledby="${headingId}">
      <div class="section-title">
        <h3 id="${headingId}">성적 정보</h3>
      </div>
      <table class="grade-table ${compact ? "compact-table" : ""}">
        <tbody>${rows}</tbody>
      </table>
    </section>
  `;
}

function renderTraits(student) {
  return `
    <section aria-labelledby="traitsTitle-${student.id}">
      <div class="section-title">
        <h3 id="traitsTitle-${student.id}">학습 특성 및 교사 메모</h3>
      </div>
      <ul class="memo-list">
        ${student.traits.map((trait) => `<li>${trait}</li>`).join("")}
        <li>${student.teacherMemo}</li>
      </ul>
    </section>
  `;
}

// AI 학생 상담 전략 도우미 패널 렌더링 함수
window.openCounselingPanel = function(studentId) {
  const student = STUDENTS.find(s => s.id === studentId);
  const aliasMap = { "10101": "학생 A", "10102": "학생 B", "10103": "학생 C" };
  const studentAlias = aliasMap[studentId] || "익명 학생";
  
  const gradeSummary = Object.entries(student.grades).map(([k,v]) => `${k}: ${v}`).join(", ");
  const learningTraits = student.traits.join(" ") + " " + student.teacherMemo;

  const container = document.getElementById("counselingPanelContainer");
  
  // 패널 HTML 주입
  container.innerHTML = `
    <section class="intro-panel" style="margin-top: 20px; padding: 25px;">
      <h2 style="font-size: 28px; text-decoration: none; color: #001eff; text-shadow: none;">AI 학생 상담 전략 도우미</h2>
      <p style="margin-top: 5px; color: #333; font-weight: 600;">선택된 학생의 정보와 고민을 바탕으로 상담 전략을 제안합니다.</p>
      
      <div style="background: #fff; padding: 15px; border-radius: 8px; border: 2px solid #001eff; margin-top: 15px;">
        <p style="margin: 0;"><strong>선택된 학생 (화면용):</strong> ${student.name} (${student.id})</p>
        <hr style="margin: 10px 0; border: 0; border-top: 1px dashed #ccc;"/>
        <p style="margin: 0 0 5px 0;"><strong>전송 데이터 미리보기 (익명화):</strong></p>
        <pre id="previewData" style="background: #f4f4f4; padding: 10px; font-size: 13px; overflow-x: auto; margin: 0; border: 1px solid #ddd;"></pre>
      </div>
      
      <div style="margin-top: 15px;">
        <label for="teacherConcern" style="font-weight: 900; color: #001eff;">교사 고민 입력:</label>
        <textarea id="teacherConcern" rows="3" style="width: 100%; padding: 10px; font-size: 14px; margin-top: 5px; border: 2px solid #aaa; border-radius: 4px;" placeholder="수업 참여는 좋은데 평가 결과가 낮습니다. 어떻게 상담하면 좋을까요?"></textarea>
      </div>

      <div style="margin-top: 15px;">
        <button id="requestCounselingBtn" class="primary-button" style="width: 100%;">AI 상담 전략 받기</button>
      </div>

      <div id="counselingResult" style="margin-top: 20px; background: #eaffff; padding: 15px; border: 3px dashed #001eff; border-radius: 8px; display: none;"></div>
      <div id="counselingError" style="margin-top: 10px; color: red; font-weight: bold; display: none;"></div>

      <p style="font-size: 12px; color: #555; margin-top: 15px; font-weight: bold;">
        * AI 상담 전략은 참고용입니다. 최종 판단과 실제 상담은 교사가 학생의 상황을 종합적으로 고려하여 진행해야 합니다.
      </p>
    </section>
  `;

  // 스크롤 이동
  container.scrollIntoView({ behavior: 'smooth' });

  const concernInput = document.getElementById("teacherConcern");
  const previewData = document.getElementById("previewData");

  // 미리보기 업데이트 함수
  const updatePreview = () => {
    previewData.textContent = JSON.stringify({
      studentAlias,
      gradeSummary,
      learningTraits,
      teacherConcern: concernInput.value.trim()
    }, null, 2);
  };

  // 초기 미리보기 설정
  updatePreview();

  // 입력할 때마다 미리보기 업데이트
  concernInput.addEventListener("input", updatePreview);

  // AI 상담 전략 받기 버튼 클릭 이벤트
  document.getElementById("requestCounselingBtn").addEventListener("click", async () => {
    const concern = concernInput.value.trim();
    const errorDiv = document.getElementById("counselingError");
    const resultDiv = document.getElementById("counselingResult");

    if (!concern) {
      errorDiv.textContent = "상담 고민을 먼저 입력해주세요.";
      errorDiv.style.display = "block";
      resultDiv.style.display = "none";
      return;
    }

    errorDiv.style.display = "none";
    resultDiv.style.display = "block";
    resultDiv.innerHTML = "<p style='margin: 0; font-weight: bold; color: #001eff;'>AI가 상담 전략을 생성하는 중입니다...</p>";

    try {
      const response = await fetch('/api/gemini-counseling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentAlias,
          gradeSummary,
          learningTraits,
          teacherConcern: concern
        })
      });

      const data = await response.json();
      if (data.success) {
        // 응답 텍스트 줄바꿈 처리
        const formattedResult = data.result.replace(/\\n/g, '<br/>');
        resultDiv.innerHTML = `<h3 style="margin-top: 0; color: #ff00aa;">AI 상담 전략 결과</h3><div style="line-height: 1.6;">${formattedResult}</div>`;
      } else {
        throw new Error(data.error || "알 수 없는 오류가 발생했습니다.");
      }
    } catch (err) {
      console.error(err);
      resultDiv.style.display = "none";
      errorDiv.textContent = "AI 상담 전략을 불러오지 못했습니다. API 키 또는 Vercel 환경 변수를 확인해주세요.";
      errorDiv.style.display = "block";
    }
  });
};

showOnly(loginView);
