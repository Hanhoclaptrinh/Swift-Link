import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  // Override handleRequest so it doesn't throw if no user
  handleRequest(err, user, info) {
    if (err || !user) {
      return null; // Trả về null thay vì ném lỗi Unauthorized
    }
    return user;
  }
}
