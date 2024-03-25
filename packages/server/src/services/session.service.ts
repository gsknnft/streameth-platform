import BaseController from '@databases/storage';
import { HttpException } from '@exceptions/HttpException';
import { ISession } from '@interfaces/session.interface';
import Organization from '@models/organization.model';
import Session from '@models/session.model';
import Event from '@models/event.model';
import { ThirdwebStorage } from '@thirdweb-dev/storage';
import { config } from '@config';

export default class SessionServcie {
  private path: string;
  private controller: BaseController<ISession>;
  constructor() {
    this.path = 'sessions';
    this.controller = new BaseController<ISession>('db', Session);
  }

  async create(data: ISession): Promise<ISession> {
    const event = await Event.findById(data.eventId);
    return this.controller.store.create(
      data.name,
      { ...data, eventSlug: event.slug },
      `${this.path}/${data.eventId}`,
    );
  }

  async update(sessionId: string, session: ISession): Promise<ISession> {
    return await this.controller.store.update(sessionId, session, session.name);
  }

  async get(sessionId: string): Promise<ISession> {
    const findSession = await this.controller.store.findById(sessionId);
    if (!findSession) throw new HttpException(404, 'Event not found');
    return findSession;
  }

  async getAll(d: {
    event: string;
    organization: string;
    speaker: string;
    stageId: string;
    assetId: string;
    onlyVideos: boolean;
    size: number;
    page: number;
  }): Promise<{
    sessions: Array<ISession>;
    totalDocuments: number;
    pageable: { page: number; size: number };
  }> {
    let filter = {};
    if (d.event != undefined) {
      let event = await Event.findOne({ slug: d.event });
      filter = { ...filter, eventId: event?._id };
    }
    if (d.organization != undefined) {
      let org = await Organization.findOne({ slug: d.organization });
      filter = { ...filter, organizationId: org?._id };
    }
    if (d.onlyVideos) {
      filter = {
        ...filter,
        $or: [{ playbackId: { $ne: '' } }, { assetId: { $ne: '' } }],
      };
    }
    if (d.assetId != undefined) {
      filter = { ...filter, assetId: d.assetId };
    }
    if (d.stageId != undefined) {
      filter = { ...filter, stageId: d.stageId };
    }
    const pageSize = Number(d.size) || 0; //total documents to be fetched
    const pageNumber = Number(d.page) || 0;
    const skip = pageSize * pageNumber - pageSize;
    const [sessions, totalDocuments] = await Promise.all([
      await this.controller.store.findAll(filter, this.path, skip, pageSize),
      await this.controller.store.findAll(filter, this.path, 0, 0),
    ]);
    return {
      sessions: sessions,
      totalDocuments: totalDocuments.length,
      pageable: {
        page: pageNumber,
        size: pageSize,
      },
    };
  }

  async deleteOne(sessionId: string): Promise<void> {
    await this.get(sessionId);
    return await this.controller.store.delete(sessionId);
  }

  async createMetadata(sessionId: string) {
    let session = await Session.findById(sessionId); //await this.get(sessionId);
    let metadata = JSON.stringify({
      name: session.name,
      description: session.description,
      external_url: `${config.baseUrl}/watch?event=${session.eventSlug}&session=${session._id}`,
      animation_url: '',
      image: session.coverImage,
      attributes: [
        {
          start: session.start,
          end: session.end,
          stageId: session.stageId,
          speakers: session.speakers,
          source: session.source,
          playbackId: session.playbackId,
          assetId: session.assetId,
          eventId: session.eventId,
          track: session.track,
          coverImage: session.coverImage,
          slug: session.slug,
          organizationId: session.organizationId,
          eventSlug: session.eventSlug,
          createdAt: session.createdAt,
          aiDescription: session.aiDescription,
          autoLabels: session.autoLabels,
          videoTranscription: session.videoTranscription,
        },
      ],
    });
    const URI = await this.upload(metadata);
    await session.updateOne({ nftURI: URI });
    return URI;
  }

  async upload(file: Express.Multer.File | {}): Promise<string> {
    const storage = new ThirdwebStorage({
      secretKey: config.storage.thirdWebSecretKey,
    });
    const URI = await storage.upload(file);
    return await storage.resolveScheme(URI);
  }
}
