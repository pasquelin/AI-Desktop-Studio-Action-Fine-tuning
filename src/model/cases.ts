import type { Proposal } from "./baseline.ts";
export type ModelCase = {
  id: string;
  language: string;
  prompt: string;
  context: string;
  expected: Proposal;
};
const requests: [language: string, project: string, cube: string][] = [
  [
    "it",
    'Crea un progetto chiamato "Atlas" in /vm/projects.',
    'Aggiungi un cubo chiamato "Marker" alla scena corrente.',
  ],
  [
    "id",
    'Buat proyek bernama "Atlas" di /vm/projects.',
    'Tambahkan kubus bernama "Marker" ke adegan saat ini.',
  ],
  [
    "ru",
    'Создай проект с именем "Atlas" в /vm/projects.',
    'Добавь куб с именем "Marker" в текущую сцену.',
  ],
  [
    "tr",
    '/vm/projects içinde "Atlas" adlı bir proje oluştur.',
    'Geçerli sahneye "Marker" adlı bir küp ekle.',
  ],
  [
    "vi",
    'Tạo dự án có tên "Atlas" trong /vm/projects.',
    'Thêm một hình lập phương có tên "Marker" vào cảnh hiện tại.',
  ],
  [
    "en",
    'Create a project named "Atlas" in /vm/projects.',
    'Add a cube named "Marker" to the current scene.',
  ],
  [
    "fr",
    'Crée un projet nommé "Atlas" dans /vm/projects.',
    'Ajoute un cube nommé "Marker" dans la scène actuelle.',
  ],
  [
    "es",
    'Crea un proyecto llamado "Atlas" en /vm/projects.',
    'Añade un cubo llamado "Marker" a la escena actual.',
  ],
  [
    "de",
    'Erstelle ein Projekt namens "Atlas" in /vm/projects.',
    'Füge der aktuellen Szene einen Würfel namens "Marker" hinzu.',
  ],
  [
    "pt",
    'Crie um projeto chamado "Atlas" em /vm/projects.',
    'Adicione um cubo chamado "Marker" à cena atual.',
  ],
  [
    "ar",
    'أنشئ مشروعًا باسم "Atlas" في /vm/projects.',
    'أضف مكعبًا باسم "Marker" إلى المشهد الحالي.',
  ],
  [
    "hi",
    '/vm/projects में "Atlas" नाम का प्रोजेक्ट बनाओ।',
    'वर्तमान दृश्य में "Marker" नाम का एक घन जोड़ो।',
  ],
  [
    "zh",
    '在 /vm/projects 中创建一个名为 "Atlas" 的项目。',
    '在当前场景中添加一个名为 "Marker" 的立方体。',
  ],
  [
    "ja",
    "/vm/projects に「Atlas」という名前のプロジェクトを作成してください。",
    "現在のシーンに「Marker」という名前の立方体を追加してください。",
  ],
  [
    "ko",
    '/vm/projects에 "Atlas"라는 프로젝트를 만드세요.',
    '현재 장면에 "Marker"라는 이름의 정육면체를 추가하세요.',
  ],
];
export const modelCases: ModelCase[] = requests.flatMap(
  ([language, project, cube]) => [
    {
      id: `${language}-project`,
      language,
      prompt: project,
      context:
        "No project is open. The explicit destination is a synthetic test path.",
      expected: {
        name: "project_create",
        arguments: { name: "Atlas", folder: "/vm/projects" },
      },
    },
    {
      id: `${language}-cube`,
      language,
      prompt: cube,
      context:
        "A project and a 3D scene are open and ready. No position was specified.",
      expected: {
        name: "node_add",
        arguments: { kind: "box", name: "Marker" },
      },
    },
  ],
);
modelCases.push(
  {
    id: "fr-scene",
    language: "fr",
    prompt: 'Crée une scène 3D nommée "Test".',
    context: "A project is open and ready.",
    expected: {
      name: "workspace_open",
      arguments: { workspace: "3d", createDocument: true, title: "Test" },
    },
  },
  {
    id: "fr-rename",
    language: "fr",
    prompt: 'Renomme le cube "Marker" en "Repère".',
    context:
      'The active scene is ready. It contains exactly one node: {"id":"cube-01","name":"Marker","type":"mesh"}.',
    expected: {
      name: "node_rename",
      arguments: { nodeId: "cube-01", name: "Repère" },
    },
  },
  {
    id: "fr-move",
    language: "fr",
    prompt: 'Place le cube "Marker" à x=2, y=1, z=-3.',
    context:
      'The active scene is ready. It contains exactly one node: {"id":"cube-01","name":"Marker","type":"mesh"}.',
    expected: {
      name: "node_transform",
      arguments: {
        nodeId: "cube-01",
        positionX: 2,
        positionY: 1,
        positionZ: -3,
      },
    },
  },
  {
    id: "fr-save",
    language: "fr",
    prompt: "Sauvegarde le document doc-01.",
    context: 'The active document has id "doc-01" and has unsaved changes.',
    expected: { name: "document_save", arguments: { documentId: "doc-01" } },
  },
);
