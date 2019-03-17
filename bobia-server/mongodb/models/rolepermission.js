import Mongoose from 'mongoose';
import { autoIncrement } from 'mongoose-plugin-autoinc';

const rolePermissionSchema = Mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    roleId: { type: Number, required: true },
    api: { type: [Number] }
  },
  {
    timestamps: true
  }
);

rolePermissionSchema.plugin(autoIncrement, {
  model: 'rolePermission',
  field: 'id',
  startAt: 1
});

export default Mongoose.model('rolePermission', rolePermissionSchema);
