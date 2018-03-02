# pub-storage
Blockchain agnostic decentralized storage of scientific publications


Decentralized file storage and query layers atop IPFS to support human readable queries. Currently, IPFS only allows look-ups for files using its hash generated while storing it in the IPFS network. And here are some of my ideas regarding how to provide a DCMI(or any other format) query layer on top of IPFS:

1. There is IPNS(Interplanetary Name System) which provides a way to link a human readable name with a file stored in IPFS. This would have worked if we were to just support look-ups based on the name of the file which is not the case for us since we are planning to support look-ups based on different attributes in addition to name such as author, published journal/conference, date published, etc. In case of DCMI all the fields listed in http://dublincore.org/documents/2005/06/13/dcmi-terms/ We'll probably use IPNS regardless to get consistent access to different versions of same file but IPNS alone won't be enough to support metadata based queries.

2. We can use a server deployed, highly available metadata store which allows look-ups based on metadata and links to the file in IPFS. This is probably the simplest solution engineering-wise. But server deployed means it defeats the purpose of decentralization. It can be a solution if don't want to be strictly decentralized. Storage will be decentralized regardless. So, thought it was worth mentioning.

3. We can work on our own solution for decentralized metadata store. It can be a fork of IPFS/IPNS or it can be an entirely different network. Which just stores the metadata -> IPFS file-link pair. Technology-wise, this is one hell of a mountain to climb. But it can be a generic metadata store so after this implementing support for multiple metadata formats will be trivial. This can in fact be our pitched product since this is something that doesn't exist as far as I know.

4. We already have different distributed/decentralized object storage projects like storj.io and others which we can use to store our metadata object. We provide publications search api on top of these kinds of projects. I have not delved much into these projects but Storj in particular seems to support some expressive queries.
