import { IsDefined, IsEmail, Length } from "class-validator";
import { BeforeInsert, Column, Entity, Index } from "typeorm";
import bcrypt from "bcryptjs";
import Model from "./model.entity";

export enum RoleEnumType {
  USER = "user",
  ADMIN = "admin",
}

@Entity("users")
export class User extends Model {
  @Column({
    nullable: true,
  })
  age: number;

  @Index("email_index")
  @Column({
    unique: true,
    nullable: false,
  })
  @IsEmail()
  // @IsDefined()
  email: string;

  @Column()
  @Length(8, 32)
  // @IsDefined()
  password: string;

  @Column({
    type: "enum",
    enum: RoleEnumType,
    default: RoleEnumType.USER,
  })
  role: RoleEnumType.USER;

  //   @Column({
  //     default: false,
  //   })
  //   verified?: boolean;

  toJSON() {
    return { ...this, password: undefined, verified: undefined };
  }

  // ***** Hash password before saving to database *****
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 12);
  }

  // ***** ? Validate password *****
  static async comparePasswords(
    candidatePassword: string,
    hashedPassword: string
  ) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
}
