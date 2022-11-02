import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId, Types } from "mongoose";

@Schema({ _id: false })
export class CenterHistory {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  schoolYear: string;

  @Prop({ type: [Types.ObjectId], default: [] })
  requiredDocumentsType: ObjectId[];

  @Prop({ type: [Types.ObjectId], default: [] })
  pendingApplicatons: ObjectId[];

  @Prop({ type: [Types.ObjectId], default: [] })
  acceptedApplications: ObjectId[];

  @Prop({ type: [Types.ObjectId], default: [] })
  rejectedApplications: ObjectId[];

  @Prop({ type: [Types.ObjectId], default: [] })
  cancelledApplications: ObjectId[];

  @Prop({ type: [Types.ObjectId], default: [] })
  admittedCandidates: ObjectId[];
}

export const CenterHistorySchema = SchemaFactory.createForClass(CenterHistory);
