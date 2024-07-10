export class AwsDto {
  fileName: string; // 파일 이름
  file: Express.Multer.File; // 파일
  ext: string; // 파일 확장자
  directory: string; // 파일 디렉토리
}
