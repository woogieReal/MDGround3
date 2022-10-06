import { ResTree } from "@/src/models/tree.model";

const mockData: ResTree[] = [
  {
    treeId: "77",
    treeType: 10,
    treeName: "javascript",
    treeContent: "javascript_내용",
    treePath: "",
    treeChildren: [
      {
        treeId: "88",
        treeType: 20,
        treeName: "Array",
        treeContent: "Array_내용",
        treePath: "77",
        treeChildren: [],
      },
      {
        treeId: "653",
        treeType: 20,
        treeName: "정규식",
        treeContent: "정규식_내용",
        treePath: "77",
        treeChildren: [],
      },
      {
        treeId: "87",
        treeType: 20,
        treeName: "Object",
        treeContent: "Object_내용",
        treePath: "77",
        treeChildren: [],
      },
      {
        treeId: "78",
        treeType: 20,
        treeName: "change element id and treeName",
        treeContent: "change element id and treeName_내용",
        treePath: "77",
        treeChildren: [],
      },
      {
        treeId: "79",
        treeType: 20,
        treeName: "window.onload",
        treeContent: "window.onload_내용",
        treePath: "77",
        treeChildren: [],
      },
      {
        treeId: "80",
        treeType: 20,
        treeName: "window.location.reload()",
        treeContent: "window.location.reload()_내용",
        treePath: "77",
        treeChildren: [],
      },
      {
        treeId: "81",
        treeType: 20,
        treeName: "async vs defer",
        treeContent: "async vs defer_내용",
        treePath: "77",
        treeChildren: [],
      },
      {
        treeId: "82",
        treeType: 20,
        treeName: "use strict",
        treeContent: "use strict_내용",
        treePath: "77",
        treeChildren: [],
      },
      {
        treeId: "83",
        treeType: 20,
        treeName: "data types: primative",
        treeContent: "data types: primative_내용",
        treePath: "77",
        treeChildren: [],
      },
      {
        treeId: "84",
        treeType: 20,
        treeName: "Operator",
        treeContent: "Operator_내용",
        treePath: "77",
        treeChildren: [],
      },
      {
        treeId: "85",
        treeType: 20,
        treeName: "Function",
        treeContent: "Function_내용",
        treePath: "77",
        treeChildren: [],
      },
      {
        treeId: "86",
        treeType: 20,
        treeName: "Class",
        treeContent: "Class_내용",
        treePath: "77",
        treeChildren: [],
      },
      {
        treeId: "89",
        treeType: 20,
        treeName: "JSON",
        treeContent: "JSON_내용",
        treePath: "77",
        treeChildren: [],
      },
      {
        treeId: "90",
        treeType: 20,
        treeName: "Promise",
        treeContent: "Promise_내용",
        treePath: "77",
        treeChildren: [],
      },
      {
        treeId: "91",
        treeType: 20,
        treeName: "aync & await",
        treeContent: "aync & await_내용",
        treePath: "77",
        treeChildren: [],
      },
      {
        treeId: "95",
        treeType: 20,
        treeName: "key event",
        treeContent: "key event_내용",
        treePath: "77",
        treeChildren: [],
      },
      {
        treeId: "317",
        treeType: 20,
        treeName: "문자열 특정문자 갯수 찾기",
        treeContent: "문자열 특정문자 갯수 찾기_내용",
        treePath: "77",
        treeChildren: [],
      },
      {
        treeId: "383",
        treeType: 20,
        treeName: "Optional chaining",
        treeContent: "Optional chaining_내용",
        treePath: "77",
        treeChildren: [],
      },
      {
        treeId: "1212",
        treeType: 20,
        treeName: "changeCommaToHash",
        treeContent: "changeCommaToHash_내용",
        treePath: "77",
        treeChildren: [],
      },
    ],
  },
  {
    treeId: "484",
    treeType: 10,
    treeName: "파이썬",
    treeContent: "파이썬_내용",
    treePath: "",
    treeChildren: [
      {
        treeId: "496",
        treeType: 10,
        treeName: "Sequence Types",
        treeContent: "Sequence Types_내용",
        treePath: "484",
        treeChildren: [
          {
            treeId: "487",
            treeType: 20,
            treeName: "\bSequence",
            treeContent: "\bSequence_내용",
            treePath: "484|496",
            treeChildren: [],
          },
          {
            treeId: "493",
            treeType: 20,
            treeName: "List",
            treeContent: "List_내용",
            treePath: "484|496",
            treeChildren: [],
          },
          {
            treeId: "494",
            treeType: 20,
            treeName: "Tuple",
            treeContent: "Tuple_내용",
            treePath: "484|496",
            treeChildren: [],
          },
          {
            treeId: "495",
            treeType: 20,
            treeName: "Range",
            treeContent: "Range_내용",
            treePath: "484|496",
            treeChildren: [],
          },
        ],
      },
      {
        treeId: "497",
        treeType: 10,
        treeName: "Text Sequence Type",
        treeContent: "Text Sequence Type_내용",
        treePath: "484",
        treeChildren: [],
      },
      {
        treeId: "501",
        treeType: 10,
        treeName: "Set Types",
        treeContent: "Set Types_내용",
        treePath: "484",
        treeChildren: [],
      },
      {
        treeId: "555",
        treeType: 10,
        treeName: "Mapping Types",
        treeContent: "Mapping Types_내용",
        treePath: "484",
        treeChildren: [],
      },
      {
        treeId: "575",
        treeType: 10,
        treeName: "Django",
        treeContent: "Django_내용",
        treePath: "484",
        treeChildren: [],
      },
      {
        treeId: "577",
        treeType: 10,
        treeName: "Django REST framework",
        treeContent: "Django REST framework_내용",
        treePath: "484",
        treeChildren: [],
      },
      {
        treeId: "485",
        treeType: 20,
        treeName: "파이썬이란",
        treeContent: "파이썬이란_내용",
        treePath: "484",
        treeChildren: [],
      },
      {
        treeId: "486",
        treeType: 20,
        treeName: "기본 문법",
        treeContent: "기본 문법_내용",
        treePath: "484",
        treeChildren: [],
      },
      {
        treeId: "488",
        treeType: 20,
        treeName: "data treeType",
        treeContent: "data treeType_내용",
        treePath: "484",
        treeChildren: [],
      },
      {
        treeId: "574",
        treeType: 20,
        treeName: "pip",
        treeContent: "pip_내용",
        treePath: "484",
        treeChildren: [],
      },
    ],
  },
  {
    treeId: "375",
    treeType: 10,
    treeName: "mysql",
    treeContent: "mysql_내용",
    treePath: "",
    treeChildren: [
      {
        treeId: "582",
        treeType: 10,
        treeName: "응용",
        treeContent: "응용_내용",
        treePath: "375",
        treeChildren: [],
      },
      {
        treeId: "671",
        treeType: 10,
        treeName: "인덱스",
        treeContent: "인덱스_내용",
        treePath: "375",
        treeChildren: [],
      },
      {
        treeId: "679",
        treeType: 10,
        treeName: "내장 함수",
        treeContent: "내장 함수_내용",
        treePath: "375",
        treeChildren: [],
      },
      {
        treeId: "1093",
        treeType: 10,
        treeName: "실행계획",
        treeContent: "실행계획_내용",
        treePath: "375",
        treeChildren: [],
      },
      {
        treeId: "680",
        treeType: 10,
        treeName: "정리",
        treeContent: "정리_내용",
        treePath: "375",
        treeChildren: [],
      },
      {
        treeId: "1105",
        treeType: 10,
        treeName: "구문분석",
        treeContent: "구문분석_내용",
        treePath: "375",
        treeChildren: [
          {
            treeId: "1125",
            treeType: 10,
            treeName: "CREATE",
            treeContent: "CREATE_내용",
            treePath: "375|1105",
            treeChildren: [],
          },
          {
            treeId: "1126",
            treeType: 10,
            treeName: "Compound Statement",
            treeContent: "Compound Statement_내용",
            treePath: "375|1105",
            treeChildren: [
              {
                treeId: "1130",
                treeType: 10,
                treeName: "Flow Control Statements",
                treeContent: "Flow Control Statements_내용",
                treePath: "375|1105|1126",
                treeChildren: [
                  {
                    treeId: "1131",
                    treeType: 20,
                    treeName: "CASE",
                    treeContent: "CASE_내용",
                    treePath: "375|1105|1126|1130",
                    treeChildren: [],
                  },
                  {
                    treeId: "1132",
                    treeType: 20,
                    treeName: "IF",
                    treeContent: "IF_내용",
                    treePath: "375|1105|1126|1130",
                    treeChildren: [],
                  },
                  {
                    treeId: "1133",
                    treeType: 20,
                    treeName: "LOOP",
                    treeContent: "LOOP_내용",
                    treePath: "375|1105|1126|1130",
                    treeChildren: [],
                  },
                  {
                    treeId: "1134",
                    treeType: 20,
                    treeName: "REPEAT",
                    treeContent: "REPEAT_내용",
                    treePath: "375|1105|1126|1130",
                    treeChildren: [],
                  },
                  {
                    treeId: "1135",
                    treeType: 20,
                    treeName: "WHILE",
                    treeContent: "WHILE_내용",
                    treePath: "375|1105|1126|1130",
                    treeChildren: [],
                  },
                ],
              },
              {
                treeId: "1138",
                treeType: 10,
                treeName: "Condition Handling",
                treeContent: "Condition Handling_내용",
                treePath: "375|1105|1126",
                treeChildren: [],
              },
              {
                treeId: "1127",
                treeType: 20,
                treeName: "BEGIN ... END",
                treeContent: "BEGIN ... END_내용",
                treePath: "375|1105|1126",
                treeChildren: [],
              },
              {
                treeId: "1128",
                treeType: 20,
                treeName: "Statement Labels",
                treeContent: "Statement Labels_내용",
                treePath: "375|1105|1126",
                treeChildren: [],
              },
              {
                treeId: "1129",
                treeType: 20,
                treeName: "DECLARE",
                treeContent: "DECLARE_내용",
                treePath: "375|1105|1126",
                treeChildren: [],
              },
              {
                treeId: "1136",
                treeType: 20,
                treeName: "CURSOR",
                treeContent: "CURSOR_내용",
                treePath: "375|1105|1126",
                treeChildren: [],
              },
            ],
          },
          {
            treeId: "1227",
            treeType: 10,
            treeName: "Transactional and Locking Statements",
            treeContent: "Transactional and Locking Statements_내용",
            treePath: "375|1105",
            treeChildren: [],
          },
        ],
      },
    ],
  },
  {
    treeId: "218",
    treeType: 10,
    treeName: "AWS",
    treeContent: "AWS_내용",
    treePath: "",
    treeChildren: [],
  },
  {
    treeId: "1141",
    treeType: 10,
    treeName: "TanStack Query",
    treeContent: "TanStack Query_내용",
    treePath: "",
    treeChildren: [],
  },
  {
    treeId: "1191",
    treeType: 10,
    treeName: "terraform",
    treeContent: "terraform_내용",
    treePath: "",
    treeChildren: [],
  },
  {
    treeId: "187",
    treeType: 10,
    treeName: "react",
    treeContent: "react_내용",
    treePath: "",
    treeChildren: [],
  },
  {
    treeId: "96",
    treeType: 10,
    treeName: "typescript",
    treeContent: "typescript_내용",
    treePath: "",
    treeChildren: [],
  },
  {
    treeId: "436",
    treeType: 10,
    treeName: "git",
    treeContent: "git_내용",
    treePath: "",
    treeChildren: [],
  },
  {
    treeId: "92",
    treeType: 10,
    treeName: "java",
    treeContent: "java_내용",
    treePath: "",
    treeChildren: [],
  },
  {
    treeId: "117",
    treeType: 10,
    treeName: "next",
    treeContent: "next_내용",
    treePath: "",
    treeChildren: [],
  },
  {
    treeId: "206",
    treeType: 10,
    treeName: "React DnD",
    treeContent: "React DnD_내용",
    treePath: "",
    treeChildren: [],
  },
  {
    treeId: "182",
    treeType: 20,
    treeName: "용어",
    treeContent: "용어_내용",
    treePath: "",
    treeChildren: [],
  },
  {
    treeId: "129",
    treeType: 20,
    treeName: "PHP",
    treeContent: "PHP_내용",
    treePath: "",
    treeChildren: [],
  },
  {
    treeId: "133",
    treeType: 20,
    treeName: "Cypress",
    treeContent: "Cypress_내용",
    treePath: "",
    treeChildren: [],
  },
  {
    treeId: "134",
    treeType: 20,
    treeName: "node.js",
    treeContent: "node.js_내용",
    treePath: "",
    treeChildren: [],
  },
  {
    treeId: "135",
    treeType: 20,
    treeName: "inversify + typescript",
    treeContent: "inversify + typescript_내용",
    treePath: "",
    treeChildren: [],
  },
  {
    treeId: "215",
    treeType: 20,
    treeName: "Redux",
    treeContent: "Redux_내용",
    treePath: "",
    treeChildren: [],
  },
  {
    treeId: "216",
    treeType: 20,
    treeName: "Firebase",
    treeContent: "Firebase_내용",
    treePath: "",
    treeChildren: [],
  },
  {
    treeId: "217",
    treeType: 20,
    treeName: "netlify",
    treeContent: "netlify_내용",
    treePath: "",
    treeChildren: [],
  },
  {
    treeId: "406",
    treeType: 20,
    treeName: "SWC",
    treeContent: "SWC_내용",
    treePath: "",
    treeChildren: [],
  },
  {
    treeId: "409",
    treeType: 20,
    treeName: "Webpack",
    treeContent: "Webpack_내용",
    treePath: "",
    treeChildren: [],
  },
  {
    treeId: "441",
    treeType: 20,
    treeName: "쿠키/세션/토큰",
    treeContent: "쿠키/세션/토큰_내용",
    treePath: "",
    treeChildren: [],
  },
  {
    treeId: "554",
    treeType: 20,
    treeName: "docker",
    treeContent: "docker_내용",
    treePath: "",
    treeChildren: [],
  },
  {
    treeId: "579",
    treeType: 20,
    treeName: "zsh",
    treeContent: "zsh_내용",
    treePath: "",
    treeChildren: [],
  },
  {
    treeId: "1090",
    treeType: 20,
    treeName: "NVM",
    treeContent: "NVM_내용",
    treePath: "",
    treeChildren: [],
  },
  {
    treeId: "1109",
    treeType: 20,
    treeName: "story book",
    treeContent: "story book_내용",
    treePath: "",
    treeChildren: [],
  },
  {
    treeId: "479",
    treeType: 20,
    treeName: "Go란",
    treeContent: "Go란_내용",
    treePath: "",
    treeChildren: [],
  },
  {
    treeId: "483",
    treeType: 20,
    treeName: "oAuth란",
    treeContent: "oAuth란_내용",
    treePath: "",
    treeChildren: [],
  },
  {
    treeId: "475",
    treeType: 20,
    treeName: "스벨트란",
    treeContent: "스벨트란_내용",
    treePath: "",
    treeChildren: [],
  },
  {
    treeId: "477",
    treeType: 20,
    treeName: "Flutter란",
    treeContent: "Flutter란_내용",
    treePath: "",
    treeChildren: [],
  },
];

export default mockData;
