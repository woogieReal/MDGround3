INSERT INTO tree (tree_id, tree_type, tree_name, tree_content, tree_path, delete_yn, created_datetime, updated_datetime, deleted_datetime, user_id) VALUES(1, 10, 'Mine', NULL, '', 'N', '2022-10-22 08:23:53', NULL, NULL, '92aa8f60-51e2-11ed-bf27-0242ac140002');
INSERT INTO tree (tree_id, tree_type, tree_name, tree_content, tree_path, delete_yn, created_datetime, updated_datetime, deleted_datetime, user_id) VALUES(2, 20, '메모', NULL, '1', 'N', '2022-10-22 08:27:37', NULL, NULL, '92aa8f60-51e2-11ed-bf27-0242ac140002');
INSERT INTO tree (tree_id, tree_type, tree_name, tree_content, tree_path, delete_yn, created_datetime, updated_datetime, deleted_datetime, user_id) VALUES(3, 20, '삭제된  파일', '삭제', '1', 'Y', '2022-10-22 08:44:01', NULL, NULL, '92aa8f60-51e2-11ed-bf27-0242ac140002');
INSERT INTO tree (tree_id, tree_type, tree_name, tree_content, tree_path, delete_yn, created_datetime, updated_datetime, deleted_datetime, user_id) VALUES(4, 20, 'vscode 단축기', '### 찾기
| 목록 | 단축기 | | |
| ---- | ---- | ----- | ---- |
| **파일찾기** | command | p | |
| **찾아바꾸기(파일)** | option | command | F |
| **찾기(전체)** | shift | command | F |
| **찾아바꾸기(전체)** | shift | command | H |
| **찾은 것 전부 바꾸기** | command | return | |
| **바꾸기 칸에서 찾기 칸으로** | shift | tab | |
| **DELETE 키** | fn | backspace | |

### 탭 관리
| 목록 | 단축기 | | |
| ---- | ---- | ----- | ---- |
| **탭 이동** | command | option | 화살표 |
| **새 탭그룹에 현재 탭 복제** | command | \\ | |
| **전체 탭 닫기**| command | K | |
| **N번 째 탭 그룹 포커싱** | command | N | |
| **현재 분할 탭 그룹에서 탭 전환** | control | tab | |

### 페이지 관리
| 목록 | 단축기 | | |
| ---- | ---- | ----- | ---- |
| **파일내 구성요소** | command | shift | O / : |
| **열 선택** | option | 선택 | |
| **열 일렬선택** | 선택 -> option | shift | 선택 |
| **문제보기** | command | shif | M |
| **페이지 업/다운** | fn | ↑/↓ | |
| **특정 라인 이동**| control | G | |
| **현재 단어와 동일 단어 모두 선택** | command | shift | L |

### 이외
| 목록 | 단축기 | | |
| ---- | ---- | ----- | ---- |
| **탐색기** | shift | command | E |
| **소스제어** | ctrl | shift | G |
| **하단 패널**| command | J | |
| **포메팅** | shift | option | F |

### 내가 만든
| 목록 | 단축기 | | |
| ---- | ---- | ----- | ---- |
|**snake case** | command | shift | 6 |
| **camel case** | command | shift | 7 |
| **pascal case** | command | shift | 8 |
| **소문자 변환** | command | shift | 9 |
| **대문자 변환** | command | shift | 0 |
| **collapse folders** | command | shift | '' |', '', 'N', '2022-10-22 08:28:47', NULL, NULL, '92aa8f60-51e2-11ed-bf27-0242ac140002');
INSERT INTO tree (tree_id, tree_type, tree_name, tree_content, tree_path, delete_yn, created_datetime, updated_datetime, deleted_datetime, user_id) VALUES(5, 20, '단축기', '### 맥
| 목록 | 단축기 | | | |
| ---- | ---- | ---- | ---- | ---- |
| **특수문자** | control | command | space | |
| **숨김파일** | command | shift |  . | |
| **이미지 연속보기** | 전체 선택 | space | | |
| **독 올리기/내리기** | command | option | D | |
| **활성화면 캡쳐** | command | shift | 4 | spacebar |

### 디비버
| 목록 | 단축기 | | |
| ---- | ---- | ----- | ---- |
| **로우 삭제** | option | fn | 삭제 |

### 터미널
| 목록 | 단축기 | | |
| ---- | ---- | ----- | ---- |
| **새 탭** | command | t | |
', '', 'N', '2022-10-22 08:29:20', NULL, NULL, '92aa8f60-51e2-11ed-bf27-0242ac140002');
INSERT INTO tree (tree_id, tree_type, tree_name, tree_content, tree_path, delete_yn, created_datetime, updated_datetime, deleted_datetime, user_id) VALUES(6, 10, '기술', '', '', 'N', '2022-10-22 08:31:25', NULL, NULL, '92aa8f60-51e2-11ed-bf27-0242ac140002');
INSERT INTO tree (tree_id, tree_type, tree_name, tree_content, tree_path, delete_yn, created_datetime, updated_datetime, deleted_datetime, user_id) VALUES(7, 10, 'javascript', NULL, '6', 'N', '2022-10-22 08:33:13', NULL, NULL, '92aa8f60-51e2-11ed-bf27-0242ac140002');
INSERT INTO tree (tree_id, tree_type, tree_name, tree_content, tree_path, delete_yn, created_datetime, updated_datetime, deleted_datetime, user_id) VALUES(8, 10, '파이썬', '', '6', 'N', '2022-10-22 08:33:36', NULL, NULL, '92aa8f60-51e2-11ed-bf27-0242ac140002');
INSERT INTO tree (tree_id, tree_type, tree_name, tree_content, tree_path, delete_yn, created_datetime, updated_datetime, deleted_datetime, user_id) VALUES(9, 20, 'Object', '## Object
---

### literals and properties
 * class가 없어도 key와 value을 가진 쌍으로 만들 수 있다.
 * 자바스크립트는 dynamically typed language 이기 때문에 Object 선언 후에도 key를 선언/삭제가 가능하다.
 * 하지만 유지보수 측면에서 좋지 않다.
``` javascript
let person = {name: ''woogie'', age: 28};
console.log(person);      -> {name: "woogie", age: 28}

person.nation = ''Korea'';
console.log(person);      -> {name: "woogie", age: 28, nation: "Korea"}

delete person.nation;
console.log(person);      -> {name: "woogie", age: 28}
```

### computed properties
 * 객체.key 또는 객체[''key''] 두 가지로 접근 가능
 * 주로 런타임 시에 동적으로 key를 주고 값을 받아야 할 때 사용한다.
 * 마찬가지로 선언 후에도 key값을 선언/삭제 가능
``` javascript
function printValue(obj, key) {
    console.log(obj[key]);
}

printValue(person, ''name'');   -> woogie
printValue(person, ''age'');    -> 28
```

### constructor function
 * class의 생성자 처럼 사용
``` javascript
function Person(name, age) {
    this.name = name;
    this.age = age;
}

let person2 = new Person(''woogie2'', 25);
console.log(person2);  -> Person {name: "woogie2", age: 25}
```

### in operator
 * 해당하는 오브젝트 안에 key가 있는지 없는지 확인 하는 것
``` javascript
console.log(''name'' in person);    -> true
console.log(''nation'' in person);  -> false
```


### for..in, for..of
 * for..in: 맵구조의 객체에서 key 값을 기준으로 value를 뽑아내는 방법
 * for..of: 리스트 구조의 객체에서 값을 뽑아내는 방법
``` javascript
for(let key in person){
    console.log(person[key]);
}
-> woogie
-> 28

const array = [1,2,3,4];
for(let value of array){
    console.log(value);    
}
-> 1
-> 2
-> 3
-> 4
```

### Object.assign
`Object.assign()` 메서드는 출처 객체들의 모든 열거 가능한 자체 속성을 복사해 대상 객체에 붙여넣습니다. 그 후 대상 객체를 반환

#### 구문
```
Object.assign(target, ...sources)
```

#### 예시
```
const target = { a: 1, b: 2 };
const source = { b: 4, c: 5 };

const returnedTarget = Object.assign(target, source);

console.log(target);
// expected output: Object { a: 1, b: 4, c: 5 }

console.log(returnedTarget);
// expected output: Object { a: 1, b: 4, c: 5 }
```

#### 설명
목표 객체의 속성 중 출처 객체와 동일한 키를 갖는 속성의 경우, 그 속성 값은 출처 객체의 속성 값으로 덮어씁니다. 출처 객체들의 속성 중에서도 키가 겹칠 경우 뒤쪽 객체의 속성 값이 앞쪽 객체의 속성 값보다 우선합니다.

### 예제
#### 객체 복제
```
const obj = { a: 1 };
const copy = Object.assign({}, obj);
console.log(copy); // { a: 1 }
```

#### 깊은 복사 주의점
`Object.assign()` 은 속성의 값을 복사하기 때문에, 깊은 복사를 수행하려면 다른 방법을 사용해야 합니다.

만약 출처 값이 객체에 대한 참조라면 참조 값만 복사합니다.
```
function test() {
  ''use strict'';

  let obj1 = { a: 0 , b: { c: 0}};
  let obj2 = Object.assign({}, obj1);
  console.log(JSON.stringify(obj2)); // { a: 0, b: { c: 0}}

  obj1.a = 1;
  console.log(JSON.stringify(obj1)); // { a: 1, b: { c: 0}}
  console.log(JSON.stringify(obj2)); // { a: 0, b: { c: 0}}

  obj2.a = 2;
  console.log(JSON.stringify(obj1)); // { a: 1, b: { c: 0}}
  console.log(JSON.stringify(obj2)); // { a: 2, b: { c: 0}}

  obj2.b.c = 3;
  console.log(JSON.stringify(obj1)); // { a: 1, b: { c: 3}}
  console.log(JSON.stringify(obj2)); // { a: 2, b: { c: 3}}

  // 깊은 복사
  obj1 = { a: 0 , b: { c: 0}};
  let obj3 = JSON.parse(JSON.stringify(obj1));
  obj1.a = 4;
  obj1.b.c = 4;
  console.log(JSON.stringify(obj3)); // { a: 0, b: { c: 0}}
}

test();
```

#### 객체 병합
```
const o1 = { a: 1 };
const o2 = { b: 2 };
const o3 = { c: 3 };

const obj = Object.assign(o1, o2, o3);
console.log(obj); // { a: 1, b: 2, c: 3 }
console.log(o1);  // { a: 1, b: 2, c: 3 }, 목표 객체 자체가 변경됨.
```

#### 같은 속성을 가진 객체 병합
```
const o1 = { a: 1, b: 1, c: 1 };
const o2 = { b: 2, c: 2 };
const o3 = { c: 3 };

const obj = Object.assign({}, o1, o2, o3);
console.log(obj); // { a: 1, b: 2, c: 3 }
```

#### 심볼 속성 복사
```
const o1 = { a: 1 };
const o2 = { [Symbol(''foo'')]: 2 };

const obj = Object.assign({}, o1, o2);
console.log(obj); // { a : 1, [Symbol("foo")]: 2 } (cf. bug 1207182 on Firefox)
Object.getOwnPropertySymbols(obj); // [Symbol(foo)]
```

#### 프로토타입 체인의 속성과 열거 불가능한 속성은 복사 불가
```
const obj = Object.create({ foo: 1 }, { // foo는 obj의 프로토타입 체인에 있음
  bar: {
    value: 2  // bar는 열거 불가능
  },
  baz: {
    value: 3,
    enumerable: true  // baz는 열거 가능한 자체 속성
  }
});

const copy = Object.assign({}, obj);
console.log(copy); // { baz: 3 }
```

#### 원시 값은 객체로 래핑
```
const v1 = ''abc'';
const v2 = true;
const v3 = 10;
const v4 = Symbol(''foo'');

const obj = Object.assign({}, v1, null, v2, undefined, v3, v4);
// 원시 값은 래핑하고, null과 undefined는 무시
// 참고: 문자열 래퍼만 자체 열거형 속성을 가질 수 있음
console.log(obj); // { "0": "a", "1": "b", "2": "c" }
```

#### 예외로 인한 복사 작업 중단
```
const target = Object.defineProperty({}, ''foo'', {
  value: 1,
  writable: false
}); // target.foo는 읽기 전용 속성

Object.assign(target, { bar: 2 }, { foo2: 3, foo: 3, foo3: 3 }, { baz: 4 });
// TypeError: "foo" is read-only
// target.foo에 할당할 때 예외 발생

console.log(target.bar);  // 2, 첫 번째 출처 객체는 성공적으로 복사함
console.log(target.foo2); // 3, 두 번째 출처 객체 중 첫 번째 속성도 성공적으로 복사함
console.log(target.foo);  // 1, 여기에서 예외가 발생했음
console.log(target.foo3); // undefined, assign 메서드가 종료됨, foo3은 복사되지 않음
console.log(target.baz);  // undefined, 세 번째 출처 객체도 복사되지 않음
```

#### 접근자 복사
```
const obj = {
  foo: 1,
  get bar() {
    return 2;
  }
};

let copy = Object.assign({}, obj);
console.log(copy);
// { foo: 1, bar: 2 }, copy.bar의 값은 obj.bar의 접근자가 반환한 값

// 속성의 온전한 기술자를 복사해 할당하는 함수
function completeAssign(target, ...sources) {
  sources.forEach(source => {
    let descriptors = Object.keys(source).reduce((descriptors, key) => {
      descriptors[key] = Object.getOwnPropertyDescriptor(source, key);
      return descriptors;
    }, {});

    // 기본적으로 Object.assign은 열거 가능한 심볼도 복사함
    Object.getOwnPropertySymbols(source).forEach(sym => {
      let descriptor = Object.getOwnPropertyDescriptor(source, sym);
      if (descriptor.enumerable) {
        descriptors[sym] = descriptor;
      }
    });
    Object.defineProperties(target, descriptors);
  });
  return target;
}

copy = completeAssign({}, obj);
console.log(copy);
// { foo:1, get bar() { return 2 } }
```', '6|7', 'N', '2022-10-22 08:34:04', NULL, NULL, '92aa8f60-51e2-11ed-bf27-0242ac140002');
INSERT INTO tree (tree_id, tree_type, tree_name, tree_content, tree_path, delete_yn, created_datetime, updated_datetime, deleted_datetime, user_id) VALUES(10, 20, 'window.onload', '## 페이지가 모두 로드 된 후 스크립트를 읽도록 하기
---

### `window.onload`
---

페이지가 다 로드되기 전에 스크립트를 읽어 들이면 document.getElementById(''id 값''); 에서  
id 값을 가진 태그가 정의 되기 이전이므로 오류가 일어날 수 있다.  
가장 쉬운 방법은 스크립트를 html 문서의 가장 아래에 두는 것.  
아니면 **window.onload** 사용한다.  

``` javascript
window.onload = function() { 스크립트 }
```

웹브라우저 자체를 담당하는 window라는 객체가 웹 문서를 불러 올 때, 문서가 사용되는 시점에 실행되는 onload 라는 함수를 내가 다시 정의한 다는 개념이다.

[참고](https://wiserloner.tistory.com/380) ', '6|7', 'N', '2022-10-22 08:35:29', NULL, NULL, '92aa8f60-51e2-11ed-bf27-0242ac140002');
INSERT INTO tree (tree_id, tree_type, tree_name, tree_content, tree_path, delete_yn, created_datetime, updated_datetime, deleted_datetime, user_id) VALUES(11, 20, '파이썬이란', '<img src=''https://mk2-bucket.s3.ap-northeast-2.amazonaws.com/1644331209419-python_logo.png''/> 

## 개요

## 명령어
### 버전확인
```
python --version
```

### 가상환경 생성
* python -m virtualenv \\<folder name\\> --python=python\\<version\\>
```
python -m virtualenv env --python=python3.10
```

### 가상환경 시작
* . \\<folder name\\>/bin/activate
```
. env/bin/activate
```

### 가상환경 종료
```
deactivate
```
', '6|8', 'N', '2022-10-22 08:35:51', NULL, NULL, '92aa8f60-51e2-11ed-bf27-0242ac140002');
