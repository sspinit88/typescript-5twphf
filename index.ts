/**
 * декоратор класса
 */
function ClassDecorator(options: { nikname: string }): Function {
  const { nikname } = { ...options };

  return (target: Function) => {
    target.prototype.nikname = nikname;
  };
}

/**
 * декоратор свойства
 * @props target - прототип класса, к которому применяется декоратор;
 * @props { string | symbol } propertyKey - имя поля, к котор применяется декоратор
 */
const PropertyDecorator = (allowlist: string[]) => {
  return (target: any, memberName: string) => {
    let currentValue: any = target[memberName];

    Object.defineProperty(target, memberName, {
      set: (newValue: any) => {
        if (!allowlist.includes(newValue)) {
          return (currentValue = allowlist[0]);
        }
        currentValue = newValue;
      },
      get: () => currentValue,
    });
  };
};

/**
 * декоратор метода
 * @props { Object } target - указывает на метод, к которому применяется декоратор;
 * @props { string | symbol } propertyKey - имя поля, к котор применяется декоратор;
 * @props { PropertyDescriptor } propertyDescriptor - дескриптор свойства, возвращает дескриптор | null
 */
const MethodDecorator = (
  target: Object,
  propertyKey: string,
  propertyDescriptor: PropertyDescriptor
) => {
  propertyDescriptor.value = (arg: string) => {
    if (arg?.length > 0) {
      return arg.trim() + ' trim';
    }

    return `secret-#-${Math.ceil(Math.random())}`;
  };
};

/*--- --- ---*/

@ClassDecorator({
  nikname: 'Guffy',
})
class User {
  @PropertyDecorator(['Claire', 'Oliver'])
  name: string;
  age: number;
  nikname: string;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  printName() {
    return this.name;
  }

  @MethodDecorator
  password(secret: string = ''): string {
    return `${this.age}${this.name}${secret}`;
  }

  setName(name: string) {
    this.name = name;
  }
}

const user = new User('Oliver!', 25);
console.log('type:', typeof User);

console.log('nikname:', user.nikname);

console.log('printName:', user.printName());

console.log('age:', user.age);

console.log('pass:', user.password(' 123 '));

console.log('pass2:', user.password());
